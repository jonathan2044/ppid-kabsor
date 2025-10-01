from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from datetime import datetime, timedelta
from .. import models
from ..database import get_db

router = APIRouter(prefix="/stats", tags=["stats"])

@router.get("/dashboard")
def get_dashboard_stats(db: Session = Depends(get_db)):
    """Get real-time dashboard statistics"""
    
    # Get current month start
    now = datetime.now()
    month_start = datetime(now.year, now.month, 1)
    
    # Permohonan bulan ini
    permohonan_bulan_ini = db.query(func.count(models.Permohonan.id)).filter(
        models.Permohonan.tanggal_permohonan >= month_start
    ).scalar() or 0
    
    # Permohonan bulan lalu untuk perhitungan persentase
    last_month_start = (month_start - timedelta(days=1)).replace(day=1)
    permohonan_bulan_lalu = db.query(func.count(models.Permohonan.id)).filter(
        models.Permohonan.tanggal_permohonan >= last_month_start,
        models.Permohonan.tanggal_permohonan < month_start
    ).scalar() or 0
    
    # Calculate percentage change
    if permohonan_bulan_lalu > 0:
        persen_perubahan = int(((permohonan_bulan_ini - permohonan_bulan_lalu) / permohonan_bulan_lalu) * 100)
    else:
        persen_perubahan = 0
    
    # Permohonan selesai bulan ini
    permohonan_selesai = db.query(func.count(models.Permohonan.id)).filter(
        models.Permohonan.tanggal_permohonan >= month_start,
        models.Permohonan.status == models.StatusPermohonanEnum.selesai
    ).scalar() or 0
    
    # Tingkat penyelesaian
    if permohonan_bulan_ini > 0:
        tingkat_selesai = int((permohonan_selesai / permohonan_bulan_ini) * 100)
    else:
        tingkat_selesai = 0
    
    # Rata-rata waktu layanan (hitung dari permohonan yang selesai)
    permohonan_list = db.query(models.Permohonan).filter(
        models.Permohonan.status == models.StatusPermohonanEnum.selesai,
        models.Permohonan.tanggal_selesai.isnot(None)
    ).limit(100).all()
    
    total_hari = 0
    count = 0
    for p in permohonan_list:
        if p.tanggal_permohonan and p.tanggal_selesai:
            days = (p.tanggal_selesai - p.tanggal_permohonan).days
            if days >= 0:
                total_hari += days
                count += 1
    
    rata_hari = round(total_hari / count, 1) if count > 0 else 0
    
    # Total dokumen informasi publik
    total_dokumen = db.query(func.count(models.InformasiPublik.id)).scalar() or 0
    
    return {
        'stats': [
            {
                'label': 'Permohonan Bulan Ini',
                'value': str(permohonan_bulan_ini),
                'change': f'{persen_perubahan:+d}% dari bulan lalu' if persen_perubahan != 0 else 'Sama dengan bulan lalu',
                'icon': 'TrendingUp',
                'color': 'text-primary'
            },
            {
                'label': 'Permohonan Selesai',
                'value': str(permohonan_selesai),
                'change': f'{tingkat_selesai}% tingkat penyelesaian',
                'icon': 'CheckCircle',
                'color': 'text-chart-1'
            },
            {
                'label': 'Rata-rata Waktu Layanan',
                'value': f'{rata_hari} hari',
                'change': 'Target: 10 hari kerja',
                'icon': 'Clock',
                'color': 'text-gold'
            },
            {
                'label': 'Total Dokumen Publik',
                'value': str(total_dokumen),
                'change': 'Informasi tersedia',
                'icon': 'FileText',
                'color': 'text-chart-3'
            }
        ]
    }

@router.get("/info-categories")
def get_info_categories_counts(db: Session = Depends(get_db)):
    """Get information categories with document counts"""
    
    # Count per kategori
    berkala = db.query(func.count(models.InformasiPublik.id)).filter(
        models.InformasiPublik.kategori == models.KategoriInformasiEnum.berkala
    ).scalar() or 0
    
    serta_merta = db.query(func.count(models.InformasiPublik.id)).filter(
        models.InformasiPublik.kategori == models.KategoriInformasiEnum.serta_merta
    ).scalar() or 0
    
    setiap_saat = db.query(func.count(models.InformasiPublik.id)).filter(
        models.InformasiPublik.kategori == models.KategoriInformasiEnum.setiap_saat
    ).scalar() or 0
    
    dikecualikan = db.query(func.count(models.InformasiDikecualikan.id)).scalar() or 0
    dokumen_khusus = db.query(func.count(models.DokumenKhusus.id)).scalar() or 0
    
    return {
        'categories': [
            {
                'icon': 'Calendar',
                'title': 'Informasi Berkala',
                'description': 'Laporan keuangan, LKPJ, LPPD',
                'count': f'{berkala} Dokumen',
                'href': '/informasi-publik?kategori=berkala'
            },
            {
                'icon': 'AlertCircle',
                'title': 'Informasi Serta-Merta',
                'description': 'Informasi darurat dan mendesak',
                'count': f'{serta_merta} Dokumen',
                'href': '/informasi-publik?kategori=serta-merta'
            },
            {
                'icon': 'Clock',
                'title': 'Informasi Setiap Saat',
                'description': 'Profil, data, prosedur layanan',
                'count': f'{setiap_saat} Dokumen',
                'href': '/informasi-publik?kategori=setiap-saat'
            },
            {
                'icon': 'ShieldAlert',
                'title': 'Informasi Dikecualikan',
                'description': 'Daftar informasi yang dikecualikan',
                'count': f'{dikecualikan} Kategori',
                'href': '/informasi-publik?kategori=dikecualikan'
            },
            {
                'icon': 'FileCheck',
                'title': 'Dokumen Khusus',
                'description': 'Maklumat, KIP, Pertimbangan',
                'count': f'{dokumen_khusus} Dokumen',
                'href': '/dokumen-khusus'
            }
        ]
    }
