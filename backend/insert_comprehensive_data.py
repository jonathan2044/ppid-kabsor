#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Insert comprehensive sample data untuk semua kategori informasi publik
"""

import sys
sys.path.append('.')

from app.database import SessionLocal
from app.models import InformasiPublik, Berita, KategoriInformasiEnum
from datetime import datetime, timedelta

def insert_comprehensive_data():
    db = SessionLocal()
    try:
        print("🗄️  Inserting comprehensive sample data for all categories...")
        
        # Clear existing data first
        db.query(InformasiPublik).delete()
        db.query(Berita).delete()
        db.commit()
        print("  🗑️  Cleared existing data")
        
        # Sample Informasi Publik untuk setiap kategori
        informasi_samples = [
            # BERKALA
            {
                "judul": "Laporan Kinerja PPID Kabupaten Sorong Tahun 2024",
                "kategori": KategoriInformasiEnum.berkala,
                "deskripsi": "Laporan kinerja tahunan PPID Kabupaten Sorong tahun 2024 yang mencakup statistik pelayanan, tingkat kepuasan masyarakat, dan capaian target.",
                "file_dokumen": "/uploads/dokumen/laporan_kinerja_ppid_2024.pdf",
                "jumlah_unduhan": 156
            },
            {
                "judul": "Profil PPID Kabupaten Sorong 2024",
                "kategori": KategoriInformasiEnum.berkala,
                "deskripsi": "Profil lengkap PPID Kabupaten Sorong mencakup visi misi, struktur organisasi, tugas dan fungsi, serta program kerja tahun 2024.",
                "file_dokumen": "/uploads/dokumen/profil_ppid_2024.pdf",
                "jumlah_unduhan": 89
            },
            {
                "judul": "Rencana Kerja PPID Tahun 2025",
                "kategori": KategoriInformasiEnum.berkala,
                "deskripsi": "Rencana kerja dan program PPID Kabupaten Sorong untuk tahun 2025 dengan fokus pada peningkatan kualitas layanan informasi publik.",
                "file_dokumen": "/uploads/dokumen/rencana_kerja_2025.pdf",
                "jumlah_unduhan": 67
            },
            
            # SERTA MERTA
            {
                "judul": "Pengumuman Gangguan Sistem Informasi PPID",
                "kategori": KategoriInformasiEnum.serta_merta,
                "deskripsi": "Pemberitahuan mengenai gangguan sistem informasi PPID yang akan dilakukan maintenance pada tanggal 25 Oktober 2024 pukul 23:00-01:00 WITA.",
                "file_dokumen": "/uploads/dokumen/pengumuman_maintenance_2024.pdf",
                "jumlah_unduhan": 234
            },
            {
                "judul": "Peringatan Cuaca Ekstrem - Update Informasi Publik",
                "kategori": KategoriInformasiEnum.serta_merta,
                "deskripsi": "Peringatan dini cuaca ekstrem di wilayah Kabupaten Sorong. Masyarakat diimbau waspada dan mengikuti protokol keamanan yang ditetapkan.",
                "file_dokumen": "/uploads/dokumen/peringatan_cuaca_oktober_2024.pdf",
                "jumlah_unduhan": 445
            },
            
            # SETIAP SAAT
            {
                "judul": "Daftar Informasi Publik yang Tersedia",
                "kategori": KategoriInformasiEnum.setiap_saat,
                "deskripsi": "Daftar lengkap informasi publik yang dapat diakses masyarakat sesuai dengan UU No. 14 Tahun 2008 tentang Keterbukaan Informasi Publik.",
                "file_dokumen": "/uploads/dokumen/daftar_informasi_publik_2024.pdf",
                "jumlah_unduhan": 312
            },
            {
                "judul": "Prosedur Permohonan Informasi Publik",
                "kategori": KategoriInformasiEnum.setiap_saat,
                "deskripsi": "Panduan lengkap tata cara pengajuan permohonan informasi publik, persyaratan, dan alur proses penyelesaian permohonan.",
                "file_dokumen": "/uploads/dokumen/prosedur_permohonan_2024.pdf",
                "jumlah_unduhan": 198
            },
            {
                "judul": "Formulir Permohonan Informasi Publik",
                "kategori": KategoriInformasiEnum.setiap_saat,
                "deskripsi": "Formulir resmi untuk pengajuan permohonan informasi publik yang dapat diunduh dan diisi oleh pemohon.",
                "file_dokumen": "/uploads/dokumen/formulir_permohonan_2024.pdf",
                "jumlah_unduhan": 567
            },
            {
                "judul": "Standar Operasional Prosedur (SOP) Layanan PPID",
                "kategori": KategoriInformasiEnum.setiap_saat,
                "deskripsi": "SOP lengkap pelayanan PPID Kabupaten Sorong untuk memastikan kualitas dan konsistensi layanan informasi publik.",
                "file_dokumen": "/uploads/dokumen/sop_layanan_ppid_2024.pdf",
                "jumlah_unduhan": 123
            },
            
            # DIKECUALIKAN
            {
                "judul": "Daftar Jenis Informasi yang Dikecualikan",
                "kategori": KategoriInformasiEnum.dikecualikan,
                "deskripsi": "Daftar kategori informasi yang dikecualikan dari akses publik sesuai dengan UU KIP, termasuk penjelasan dasar hukum pengecualian.",
                "file_dokumen": "/uploads/dokumen/daftar_informasi_dikecualikan_2024.pdf",
                "jumlah_unduhan": 78
            },
            {
                "judul": "Pedoman Klasifikasi Informasi Rahasia",
                "kategori": KategoriInformasiEnum.dikecualikan,
                "deskripsi": "Pedoman untuk klasifikasi informasi yang bersifat rahasia dan tidak dapat diakses oleh publik berdasarkan peraturan yang berlaku.",
                "file_dokumen": "/uploads/dokumen/pedoman_klasifikasi_rahasia_2024.pdf",
                "jumlah_unduhan": 45
            }
        ]
        
        # Insert Informasi Publik
        for data in informasi_samples:
            informasi = InformasiPublik(**data)
            db.add(informasi)
            print(f"  ✅ Added: {data['judul']} ({data['kategori'].value})")
        
        # Sample Berita yang relevan
        berita_samples = [
            {
                "judul": "PPID Kabupaten Sorong Raih Penghargaan Keterbukaan Informasi Publik 2024",
                "slug": "ppid-sorong-raih-penghargaan-kip-2024",
                "konten": """
                <p>PPID Kabupaten Sorong meraih penghargaan sebagai PPID Terbaik tingkat Provinsi Papua Barat dalam Anugerah Keterbukaan Informasi Publik (KIP) 2024.</p>
                
                <p>Penghargaan ini diberikan atas komitmen tinggi dalam memberikan layanan informasi publik yang berkualitas kepada masyarakat. Sepanjang tahun 2024, PPID Kabupaten Sorong telah melayani lebih dari 500 permohonan informasi publik dengan tingkat kepuasan masyarakat mencapai 95%.</p>
                
                <p>"Penghargaan ini adalah bukti komitmen kami dalam transparansi dan akuntabilitas pemerintahan," ujar Kepala PPID Kabupaten Sorong.</p>
                """,
                "gambar": "/uploads/berita/penghargaan_kip_2024.jpg",
                "penulis": "Tim PPID Kabupaten Sorong",
                "views": 156
            },
            {
                "judul": "Peluncuran Portal Digital PPID Kabupaten Sorong",
                "slug": "peluncuran-portal-digital-ppid-sorong",
                "konten": """
                <p>Pemerintah Kabupaten Sorong resmi meluncurkan portal digital PPID yang memudahkan masyarakat dalam mengakses informasi publik secara online 24 jam.</p>
                
                <p>Fitur-fitur yang tersedia meliputi:</p>
                <ul>
                    <li>Permohonan informasi publik online</li>
                    <li>Tracking status permohonan real-time</li>
                    <li>Download dokumen informasi publik</li>
                    <li>Layanan konsultasi online</li>
                    <li>Statistik layanan informasi</li>
                </ul>
                
                <p>Portal ini dapat diakses melalui website resmi PPID Kabupaten Sorong dan telah terintegrasi dengan sistem manajemen dokumen terpusat.</p>
                """,
                "gambar": "/uploads/berita/portal_digital_ppid.jpg", 
                "penulis": "Humas Kabupaten Sorong",
                "views": 289
            },
            {
                "judul": "Sosialisasi UU KIP kepada Seluruh ASN Kabupaten Sorong",
                "slug": "sosialisasi-uu-kip-asn-2024",
                "konten": """
                <p>PPID Kabupaten Sorong menggelar sosialisasi Undang-Undang Keterbukaan Informasi Publik (UU KIP) kepada 150 Aparatur Sipil Negara dari berbagai OPD.</p>
                
                <p>Materi sosialisasi mencakup:</p>
                <ul>
                    <li>Pengertian dan ruang lingkup informasi publik</li>
                    <li>Hak dan kewajiban ASN dalam pengelolaan informasi</li>
                    <li>Prosedur penanganan permohonan informasi</li>
                    <li>Sanksi pelanggaran UU KIP</li>
                    <li>Best practices implementasi transparansi</li>
                </ul>
                
                <p>Kegiatan ini bertujuan untuk meningkatkan pemahaman ASN tentang pentingnya keterbukaan informasi publik dalam mendukung good governance.</p>
                """,
                "gambar": "/uploads/berita/sosialisasi_uu_kip.jpg",
                "penulis": "PPID Kabupaten Sorong", 
                "views": 167
            },
            {
                "judul": "Workshop Pengelolaan Dokumen Informasi Publik",
                "slug": "workshop-pengelolaan-dokumen-informasi-publik",
                "konten": """
                <p>PPID Kabupaten Sorong menyelenggarakan workshop pengelolaan dokumen informasi publik untuk meningkatkan kualitas layanan dan keamanan data.</p>
                
                <p>Workshop ini menghadirkan narasumber ahli dari Komisi Informasi Pusat dan membahas:</p>
                <ul>
                    <li>Sistem klasifikasi dokumen informasi</li>
                    <li>Digitalisasi dan pengarsipan elektronik</li>
                    <li>Keamanan informasi dan privacy protection</li>
                    <li>Standard Operating Procedure (SOP) terbaru</li>
                </ul>
                
                <p>Peserta workshop terdiri dari petugas PPID dari seluruh OPD di lingkungan Pemerintah Kabupaten Sorong.</p>
                """,
                "gambar": "/uploads/berita/workshop_dokumen.jpg",
                "penulis": "Tim PPID Kabupaten Sorong",
                "views": 134
            }
        ]
        
        # Insert Berita
        for data in berita_samples:
            berita = Berita(**data)
            db.add(berita)
            print(f"  ✅ Added: {data['judul']}")
        
        db.commit()
        print("✅ Comprehensive sample data insertion completed!")
        
        # Show summary by category
        for kategori in KategoriInformasiEnum:
            count = db.query(InformasiPublik).filter(InformasiPublik.kategori == kategori).count()
            print(f"   📊 {kategori.value}: {count} dokumen")
        
        total_berita = db.query(Berita).count()
        print(f"   📰 Total Berita: {total_berita}")
        
    except Exception as e:
        print(f"❌ Error inserting comprehensive data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    insert_comprehensive_data()