from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models import FAQ
from ..schemas import FAQCreate, FAQResponse
from ..auth import get_current_admin_user

router = APIRouter(prefix="/faq", tags=["faq"])

@router.post("/create", response_model=FAQResponse)
def create_faq(
    faq: FAQCreate,
    current_user = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    new_faq = FAQ(
        pertanyaan=faq.pertanyaan,
        jawaban=faq.jawaban,
        urutan=faq.urutan
    )
    
    db.add(new_faq)
    db.commit()
    db.refresh(new_faq)
    
    return new_faq

@router.get("/list", response_model=List[FAQResponse])
def list_faq(db: Session = Depends(get_db)):
    faq_list = db.query(FAQ).order_by(FAQ.urutan).all()
    return faq_list

@router.put("/{faq_id}", response_model=FAQResponse)
def update_faq(
    faq_id: int,
    faq: FAQCreate,
    current_user = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    db_faq = db.query(FAQ).filter(FAQ.id == faq_id).first()
    
    if not db_faq:
        raise HTTPException(status_code=404, detail="FAQ tidak ditemukan")
    
    db_faq.pertanyaan = faq.pertanyaan
    db_faq.jawaban = faq.jawaban
    db_faq.urutan = faq.urutan
    
    db.commit()
    db.refresh(db_faq)
    
    return db_faq

@router.delete("/{faq_id}")
def delete_faq(
    faq_id: int,
    current_user = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    faq = db.query(FAQ).filter(FAQ.id == faq_id).first()
    
    if not faq:
        raise HTTPException(status_code=404, detail="FAQ tidak ditemukan")
    
    db.delete(faq)
    db.commit()
    
    return {"message": "FAQ berhasil dihapus"}
