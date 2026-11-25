from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
import bcrypt
import hashlib
import hmac
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from .database import get_db
from .models import User
import os

SECRET_KEY = os.getenv("SESSION_SECRET", "your-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days

security = HTTPBearer()

# bcrypt hanya membaca 72 byte pertama dari password
BCRYPT_MAX_BYTES = 72
BCRYPT_PREFIXES = ("$2a$", "$2b$", "$2y$")


def _password_bytes(password: str) -> bytes:
    return password.encode("utf-8")[:BCRYPT_MAX_BYTES]


def get_password_hash(password: str) -> str:
    """Hash password dengan bcrypt.

    Dipakai langsung, bukan lewat passlib: passlib 1.7.4 tidak kompatibel dengan
    bcrypt >= 4.1 (deteksi backend-nya melempar ValueError), sehingga dulu semua
    password diam-diam jatuh ke cadangan SHA256 yang jauh lebih lemah.
    """
    return bcrypt.hashpw(_password_bytes(password), bcrypt.gensalt()).decode("utf-8")


def get_sha256_hash(password: str) -> str:
    """Hash lama (SHA256 + salt tetap). Hanya untuk memverifikasi akun warisan."""
    return hashlib.sha256((password + "ppid_salt_2024").encode()).hexdigest()


def is_legacy_hash(hashed_password: str) -> bool:
    """True bila hash masih format SHA256 lama, sehingga perlu ditingkatkan."""
    return not hashed_password.startswith(BCRYPT_PREFIXES)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    if not hashed_password:
        return False
    if hashed_password.startswith(BCRYPT_PREFIXES):
        try:
            return bcrypt.checkpw(_password_bytes(plain_password), hashed_password.encode("utf-8"))
        except ValueError:
            return False
    # Akun warisan: bandingkan dengan waktu tetap agar tidak bisa ditebak lewat timing
    return hmac.compare_digest(get_sha256_hash(plain_password), hashed_password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def decode_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    token = credentials.credentials
    payload = decode_token(token)

    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
        )

    username: str = payload.get("sub")
    if username is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
        )

    user = db.query(User).filter(User.username == username).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Akun ini sudah dinonaktifkan",
        )

    return user


async def get_current_admin_user(
    current_user: User = Depends(get_current_user)
) -> User:
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions",
        )
    return current_user


async def get_current_content_user(
    current_user: User = Depends(get_current_user)
) -> User:
    """Admin dan operator boleh mengelola konten (berita, FAQ, galeri, informasi, permohonan)."""
    if current_user.role not in ("admin", "operator"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions",
        )
    return current_user
