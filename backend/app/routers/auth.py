from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models import User, RoleEnum
from ..schemas import (
    UserCreate,
    UserUpdate,
    UserLogin,
    UserResponse,
    PasswordChange,
    PasswordReset,
    Token,
)
from ..auth import (
    get_password_hash,
    verify_password,
    is_legacy_hash,
    create_access_token,
    get_current_user,
    get_current_admin_user,
)

router = APIRouter(prefix="/auth", tags=["auth"])


def _ambil_pengguna(db: Session, user_id: int) -> User:
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Pengguna tidak ditemukan")
    return user


@router.post("/login", response_model=Token)
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user.username).first()

    if not db_user or not verify_password(user.password, db_user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Username atau password salah",
        )

    if not db_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Akun ini sudah dinonaktifkan. Hubungi admin.",
        )

    # Akun lama masih bersandi SHA256; tingkatkan ke bcrypt begitu passwordnya terbukti benar
    if is_legacy_hash(db_user.password):
        db_user.password = get_password_hash(user.password)
        db.commit()

    access_token = create_access_token(data={"sub": db_user.username})
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user


@router.post("/change-password", status_code=status.HTTP_204_NO_CONTENT)
def change_password(
    data: PasswordChange,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Ganti password sendiri. Berlaku untuk admin maupun operator."""
    if not verify_password(data.password_lama, current_user.password):
        raise HTTPException(status_code=400, detail="Password lama salah")

    if data.password_baru == data.password_lama:
        raise HTTPException(status_code=400, detail="Password baru harus berbeda dari password lama")

    current_user.password = get_password_hash(data.password_baru)
    db.commit()


@router.get("/users", response_model=List[UserResponse])
def daftar_pengguna(
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db),
):
    return db.query(User).order_by(User.id).all()


@router.post("/users", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def tambah_pengguna(
    user: UserCreate,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db),
):
    username = user.username.strip().lower()
    email = str(user.email).strip().lower()

    if db.query(User).filter(func.lower(User.username) == username).first():
        raise HTTPException(status_code=400, detail="Username sudah dipakai")
    if db.query(User).filter(func.lower(User.email) == email).first():
        raise HTTPException(status_code=400, detail="Email sudah dipakai")

    new_user = User(
        username=username,
        email=email,
        password=get_password_hash(user.password),
        nama_lengkap=user.nama_lengkap.strip(),
        role=user.role,
        is_active=True,
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


@router.patch("/users/{user_id}", response_model=UserResponse)
def ubah_pengguna(
    user_id: int,
    data: UserUpdate,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db),
):
    user = _ambil_pengguna(db, user_id)

    # Larangan menyentuh role/status akun sendiri sekaligus menjamin selalu ada
    # admin aktif: pemanggil endpoint ini pasti admin yang aktif, dan ia tidak
    # bisa menurunkan atau menonaktifkan dirinya sendiri.
    if user.id == current_user.id and (data.role is not None or data.is_active is not None):
        raise HTTPException(
            status_code=400,
            detail="Anda tidak bisa mengubah role atau status akun sendiri",
        )

    if data.email is not None:
        email = str(data.email).strip().lower()
        bentrok = (
            db.query(User)
            .filter(func.lower(User.email) == email, User.id != user.id)
            .first()
        )
        if bentrok:
            raise HTTPException(status_code=400, detail="Email sudah dipakai")
        user.email = email

    if data.nama_lengkap is not None:
        user.nama_lengkap = data.nama_lengkap.strip()
    if data.role is not None:
        user.role = data.role
    if data.is_active is not None:
        user.is_active = data.is_active

    db.commit()
    db.refresh(user)
    return user


@router.post("/users/{user_id}/reset-password", status_code=status.HTTP_204_NO_CONTENT)
def reset_password_pengguna(
    user_id: int,
    data: PasswordReset,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db),
):
    user = _ambil_pengguna(db, user_id)

    if user.id == current_user.id:
        raise HTTPException(
            status_code=400,
            detail="Untuk akun sendiri gunakan Ganti Password (butuh password lama)",
        )

    user.password = get_password_hash(data.password_baru)
    db.commit()


@router.delete("/users/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def hapus_pengguna(
    user_id: int,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db),
):
    user = _ambil_pengguna(db, user_id)

    # Admin tidak boleh menghapus dirinya sendiri; karena pemanggil selalu admin
    # aktif, aturan ini membuat akun admin tidak mungkin habis.
    if user.id == current_user.id:
        raise HTTPException(status_code=400, detail="Anda tidak bisa menghapus akun sendiri")

    db.delete(user)
    db.commit()
