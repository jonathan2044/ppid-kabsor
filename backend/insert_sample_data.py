#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Insert sample data ke database PPID Kabupaten Sorong
"""

import sys
sys.path.append('.')

from app.database import SessionLocal
from app.models import InformasiPublik, Berita, KategoriInformasiEnum
from datetime import datetime, timedelta

def insert_sample_data():
    db = SessionLocal()
    try:
        print("🗄️  Inserting sample data for PPID Kabupaten Sorong...")
        
        # Sample Informasi Publik
        informasi_samples = [
            {
                "judul": "Profil Singkat PPID Kabupaten Sorong",
                "kategori": KategoriInformasiEnum.berkala,
                "deskripsi": "Profil lengkap PPID Kabupaten Sorong beserta tugas dan fungsinya dalam memberikan layanan informasi publik kepada masyarakat.",
                "file_dokumen": "/uploads/dokumen/profil_ppid_2024.pdf",
                "jumlah_unduhan": 42
            },
            {
                "judul": "Laporan Kinerja PPID Triwulan III 2024",
                "kategori": KategoriInformasiEnum.berkala,
                "deskripsi": "Laporan kinerja PPID Kabupaten Sorong untuk periode Januari - September 2024, meliputi statistik permohonan informasi dan tingkat kepuasan masyarakat.",
                "file_dokumen": "/uploads/dokumen/laporan_kinerja_q3_2024.pdf",
                "jumlah_unduhan": 28
            },
            {
                "judul": "Daftar Informasi Publik yang Tersedia",
                "kategori": KategoriInformasiEnum.setiap_saat,
                "deskripsi": "Daftar lengkap informasi publik yang dapat diakses masyarakat sesuai dengan Undang-Undang No. 14 Tahun 2008 tentang Keterbukaan Informasi Publik.",
                "file_dokumen": "/uploads/dokumen/daftar_informasi_publik_2024.pdf",
                "jumlah_unduhan": 67
            },
            {
                "judul": "Prosedur Permohonan Informasi Publik",
                "kategori": KategoriInformasiEnum.setiap_saat,
                "deskripsi": "Panduan lengkap tata cara permohonan informasi publik, mulai dari pengajuan hingga proses penyelesaian permohonan.",
                "file_dokumen": "/uploads/dokumen/prosedur_permohonan_2024.pdf",
                "jumlah_unduhan": 89
            },
            {
                "judul": "Pengumuman Gangguan Sistem Informasi",
                "kategori": KategoriInformasiEnum.serta_merta,
                "deskripsi": "Pemberitahuan mengenai gangguan sistem informasi PPID yang akan dilakukan pemeliharaan pada tanggal 25 Oktober 2024.",
                "file_dokumen": "/uploads/dokumen/pengumuman_maintenance_2024.pdf",
                "jumlah_unduhan": 15
            },
            {
                "judul": "Informasi yang Dikecualikan",
                "kategori": KategoriInformasiEnum.dikecualikan,
                "deskripsi": "Daftar informasi yang dikecualikan dari keterbukaan informasi publik sesuai dengan Undang-Undang KIP.",
                "file_dokumen": "/uploads/dokumen/informasi_dikecualikan_2024.pdf",
                "jumlah_unduhan": 23
            }
        ]
        
        # Insert Informasi Publik
        for data in informasi_samples:
            # Check if already exists
            existing = db.query(InformasiPublik).filter(InformasiPublik.judul == data["judul"]).first()
            if not existing:
                informasi = InformasiPublik(**data)
                db.add(informasi)
                print(f"  ✅ Added: {data['judul']}")
            else:
                print(f"  ⚠️  Exists: {data['judul']}")
        
        # Sample Berita
        berita_samples = [
            {
                "judul": "PPID Kabupaten Sorong Raih Penghargaan Keterbukaan Informasi Publik 2024",
                "slug": "ppid-sorong-raih-penghargaan-kip-2024",
                "konten": """
                <p>PPID Kabupaten Sorong meraih penghargaan sebagai PPID Terbaik tingkat Provinsi Papua Barat dalam Anugerah Keterbukaan Informasi Publik (KIP) 2024. Penghargaan ini diberikan atas komitmen tinggi dalam memberikan layanan informasi publik yang berkualitas kepada masyarakat.</p>
                
                <p>Kepala PPID Kabupaten Sorong menyampaikan rasa syukur dan berterima kasih atas dukungan seluruh masyarakat Kabupaten Sorong. "Penghargaan ini adalah bukti komitmen kami dalam transparansi dan akuntabilitas pemerintahan," ujarnya.</p>
                
                <p>PPID Kabupaten Sorong telah melayani lebih dari 500 permohonan informasi publik sepanjang tahun 2024 dengan tingkat kepuasan masyarakat mencapai 95%.</p>
                """,
                "gambar": "/uploads/berita/penghargaan_kip_2024.jpg",
                "penulis": "Tim PPID Kabupaten Sorong",
                "views": 156
            },
            {
                "judul": "Peluncuran Portal Digital PPID Kabupaten Sorong",
                "slug": "peluncuran-portal-digital-ppid-sorong",
                "konten": """
                <p>Pemerintah Kabupaten Sorong resmi meluncurkan portal digital PPID yang memudahkan masyarakat dalam mengakses informasi publik secara online. Portal ini dapat diakses 24 jam melalui website resmi PPID Kabupaten Sorong.</p>
                
                <p>Fitur-fitur yang tersedia dalam portal digital ini meliputi:</p>
                <ul>
                    <li>Permohonan informasi publik online</li>
                    <li>Tracking status permohonan</li>
                    <li>Download dokumen informasi publik</li>
                    <li>Layanan konsultasi online</li>
                </ul>
                
                <p>Dengan adanya portal digital ini, diharapkan akses masyarakat terhadap informasi publik semakin mudah dan cepat.</p>
                """,
                "gambar": "/uploads/berita/portal_digital_ppid.jpg", 
                "penulis": "Humas Kabupaten Sorong",
                "views": 89
            },
            {
                "judul": "Sosialisasi UU KIP kepada Aparatur Sipil Negara",
                "slug": "sosialisasi-uu-kip-asn-2024",
                "konten": """
                <p>PPID Kabupaten Sorong menggelar sosialisasi Undang-Undang Keterbukaan Informasi Publik (UU KIP) kepada seluruh Aparatur Sipil Negara (ASN) di lingkungan Pemerintah Kabupaten Sorong. Kegiatan ini bertujuan untuk meningkatkan pemahaman ASN tentang pentingnya keterbukaan informasi publik.</p>
                
                <p>Materi sosialisasi meliputi:</p>
                <ul>
                    <li>Pengertian dan ruang lingkup informasi publik</li>
                    <li>Hak dan kewajiban ASN dalam pengelolaan informasi</li>
                    <li>Prosedur penanganan permohonan informasi</li>
                    <li>Sanksi pelanggaran UU KIP</li>
                </ul>
                
                <p>Kegiatan ini dihadiri oleh 150 ASN dari berbagai OPD di Kabupaten Sorong.</p>
                """,
                "gambar": "/uploads/berita/sosialisasi_uu_kip.jpg",
                "penulis": "PPID Kabupaten Sorong", 
                "views": 67
            }
        ]
        
        # Insert Berita
        for data in berita_samples:
            # Check if already exists
            existing = db.query(Berita).filter(Berita.slug == data["slug"]).first()
            if not existing:
                berita = Berita(**data)
                db.add(berita)
                print(f"  ✅ Added: {data['judul']}")
            else:
                print(f"  ⚠️  Exists: {data['judul']}")
        
        db.commit()
        print("✅ Sample data insertion completed!")
        
        # Show summary
        total_informasi = db.query(InformasiPublik).count()
        total_berita = db.query(Berita).count()
        
        print(f"\n📊 Database Summary:")
        print(f"   Total Informasi Publik: {total_informasi}")
        print(f"   Total Berita: {total_berita}")
        
    except Exception as e:
        print(f"❌ Error inserting sample data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    insert_sample_data()