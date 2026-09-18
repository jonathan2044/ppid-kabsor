from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict
import json
from .. import models
from ..auth import get_current_admin_user
from ..database import get_db
from ..schemas import HeroUpdate, KontakUpdate, ProfilUpdate

router = APIRouter(prefix="/pengaturan", tags=["pengaturan"])

@router.get("/hero")
def get_hero_content(db: Session = Depends(get_db)):
    """Get hero section content"""
    settings = db.query(models.Pengaturan).filter(
        models.Pengaturan.key.in_(['hero_title', 'hero_subtitle', 'hero_bg_image'])
    ).all()
    
    result = {
        'title': 'Portal PPID Kabupaten Sorong',
        'subtitle': 'Transparansi dan Keterbukaan Informasi Publik untuk Masyarakat Kabupaten Sorong',
        'bg_image': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070'
    }
    
    for setting in settings:
        if setting.key == 'hero_title':
            result['title'] = setting.value
        elif setting.key == 'hero_subtitle':
            result['subtitle'] = setting.value
        elif setting.key == 'hero_bg_image':
            result['bg_image'] = setting.value
    
    return result

@router.get("/kontak")
def get_kontak_info(db: Session = Depends(get_db)):
    """Get contact information"""
    settings = db.query(models.Pengaturan).filter(
        models.Pengaturan.key.in_([
            'kontak_alamat', 'kontak_telepon', 'kontak_fax', 
            'kontak_email', 'kontak_jam_senin_kamis', 'kontak_jam_jumat'
        ])
    ).all()
    
    result = {
        'alamat': 'Kantor Bupati Kabupaten Sorong\nJl. Pemerintahan No. 1\nAimas, Kabupaten Sorong\nPapua Barat Daya 98417',
        'telepon': '(0951) 321234',
        'fax': '(0951) 321235',
        'email': 'ppid@sorongkab.go.id',
        'jam_senin_kamis': '08:00 - 16:00 WIT',
        'jam_jumat': '08:00 - 11:30 WIT'
    }
    
    for setting in settings:
        if setting.key == 'kontak_alamat':
            result['alamat'] = setting.value
        elif setting.key == 'kontak_telepon':
            result['telepon'] = setting.value
        elif setting.key == 'kontak_fax':
            result['fax'] = setting.value
        elif setting.key == 'kontak_email':
            result['email'] = setting.value
        elif setting.key == 'kontak_jam_senin_kamis':
            result['jam_senin_kamis'] = setting.value
        elif setting.key == 'kontak_jam_jumat':
            result['jam_jumat'] = setting.value
    
    return result

@router.get("/profil")
def get_profil_ppid(db: Session = Depends(get_db)):
    """Get PPID profile content"""
    settings = db.query(models.Pengaturan).filter(
        models.Pengaturan.key.in_([
            'profil_tentang', 'profil_visi', 'profil_misi',
            'profil_tugas_pokok', 'profil_fungsi'
        ])
    ).all()
    
    result = {
        'tentang': 'Pejabat Pengelola Informasi dan Dokumentasi (PPID) Kabupaten Sorong adalah lembaga yang bertanggung jawab dalam pengelolaan dan pelayanan informasi publik di lingkungan Pemerintah Kabupaten Sorong.',
        'visi': 'Mewujudkan pelayanan informasi publik yang transparan, akuntabel, dan berkualitas untuk meningkatkan partisipasi masyarakat dalam pembangunan Kabupaten Sorong.',
        'misi': [
            'Menyediakan dan memberikan informasi publik yang akurat, lengkap, dan terkini',
            'Membangun sistem pengelolaan informasi dan dokumentasi yang efektif dan efisien',
            'Meningkatkan kualitas layanan informasi publik melalui pemanfaatan teknologi informasi',
            'Mendorong partisipasi aktif masyarakat dalam pengawasan penyelenggaraan pemerintahan',
            'Memastikan perlindungan hak-hak pemohon informasi sesuai dengan ketentuan perundang-undangan'
        ],
        'tugas_pokok': 'Melaksanakan pengelolaan, penyimpanan, pendokumentasian, penyediaan, dan pelayanan informasi publik di lingkungan Pemerintah Kabupaten Sorong.',
        'fungsi': [
            'Penghimpunan informasi publik dari seluruh unit kerja di lingkungan Pemkab Sorong',
            'Pengklasifikasian dan pendokumentasian informasi publik',
            'Penyediaan dan pelayanan informasi publik kepada masyarakat',
            'Pengelolaan sistem informasi dan dokumentasi',
            'Pengujian konsekuensi atas informasi yang dikecualikan',
            'Pemutakhiran informasi publik secara berkala',
            'Penyusunan laporan pelaksanaan pelayanan informasi publik'
        ]
    }
    
    for setting in settings:
        if setting.key == 'profil_tentang':
            result['tentang'] = setting.value
        elif setting.key == 'profil_visi':
            result['visi'] = setting.value
        elif setting.key == 'profil_misi':
            import json
            try:
                result['misi'] = json.loads(setting.value)
            except:
                result['misi'] = setting.value.split('\n')
        elif setting.key == 'profil_tugas_pokok':
            result['tugas_pokok'] = setting.value
        elif setting.key == 'profil_fungsi':
            import json
            try:
                result['fungsi'] = json.loads(setting.value)
            except:
                result['fungsi'] = setting.value.split('\n')
    
    return result

@router.get("/footer")
def get_footer_links(db: Session = Depends(get_db)):
    """Get footer navigation links"""
    return {
        'Tentang PPID': [
            {'label': 'Profil Singkat', 'href': '/profil-ppid'},
            {'label': 'Visi & Misi', 'href': '/profil-ppid#visi-misi'},
            {'label': 'Struktur Organisasi', 'href': '/profil-ppid#struktur'},
            {'label': 'Tugas & Fungsi', 'href': '/profil-ppid#tugas-fungsi'}
        ],
        'Layanan': [
            {'label': 'Permohonan Informasi', 'href': '/permohonan'},
            {'label': 'Tracking Permohonan', 'href': '/tracking'},
            {'label': 'Pengajuan Keberatan', 'href': '/keberatan'},
            {'label': 'FAQ', 'href': '/faq'}
        ],
        'Informasi': [
            {'label': 'Informasi Berkala', 'href': '/informasi-publik?kategori=berkala'},
            {'label': 'Informasi Serta-Merta', 'href': '/informasi-publik?kategori=serta-merta'},
            {'label': 'Informasi Setiap Saat', 'href': '/informasi-publik?kategori=setiap-saat'},
            {'label': 'Regulasi', 'href': '/informasi-publik?kategori=regulasi'}
        ],
        'Legal': [
            {'label': 'Dasar Hukum', 'href': '/profil-ppid#dasar-hukum'},
            {'label': 'SOP', 'href': '/sop'},
            {'label': 'Maklumat Pelayanan', 'href': '/maklumat'},
            {'label': 'Privasi', 'href': '/privasi'}
        ]
    }

# Field form admin -> key di tabel pengaturan (harus sama dengan key yang dibaca endpoint GET)
HERO_KEYS = {'title': 'hero_title', 'subtitle': 'hero_subtitle', 'bg_image': 'hero_bg_image'}
KONTAK_KEYS = {
    'alamat': 'kontak_alamat', 'telepon': 'kontak_telepon', 'fax': 'kontak_fax',
    'email': 'kontak_email', 'jam_senin_kamis': 'kontak_jam_senin_kamis', 'jam_jumat': 'kontak_jam_jumat'
}
PROFIL_KEYS = {
    'tentang': 'profil_tentang', 'visi': 'profil_visi', 'misi': 'profil_misi',
    'tugas_pokok': 'profil_tugas_pokok', 'fungsi': 'profil_fungsi'
}

def save_settings(db: Session, key_map: Dict[str, str], values: dict):
    for field, key in key_map.items():
        value = values[field]
        if isinstance(value, list):
            value = json.dumps(value, ensure_ascii=False)
        setting = db.query(models.Pengaturan).filter(models.Pengaturan.key == key).first()
        if setting:
            setting.value = value
        else:
            db.add(models.Pengaturan(key=key, value=value))
    db.commit()

@router.put("/hero")
def update_hero_content(
    data: HeroUpdate,
    current_user = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    save_settings(db, HERO_KEYS, data.model_dump())
    return get_hero_content(db)

@router.put("/kontak")
def update_kontak_info(
    data: KontakUpdate,
    current_user = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    save_settings(db, KONTAK_KEYS, data.model_dump())
    return get_kontak_info(db)

@router.put("/profil")
def update_profil_ppid(
    data: ProfilUpdate,
    current_user = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    save_settings(db, PROFIL_KEYS, data.model_dump())
    return get_profil_ppid(db)
