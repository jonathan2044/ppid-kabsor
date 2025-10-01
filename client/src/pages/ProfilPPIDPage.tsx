import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Target, Users, Scale, Building2, BookOpen } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface ProfilInfo {
  tentang: string;
  visi: string;
  misi: string[];
  tugas_pokok: string;
  fungsi: string[];
}

export default function ProfilPPIDPage() {
  const { data: profilInfo } = useQuery<ProfilInfo>({
    queryKey: ['/api/pengaturan/profil'],
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Profil PPID</h1>
            <p className="text-muted-foreground">
              Pejabat Pengelola Informasi dan Dokumentasi Kabupaten Sorong
            </p>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                Tentang PPID Kabupaten Sorong
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                {profilInfo?.tentang || 'Memuat informasi...'}
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Visi dan Misi
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Visi</h3>
                <p className="text-muted-foreground">
                  {profilInfo?.visi || 'Memuat visi...'}
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="font-semibold mb-3">Misi</h3>
                <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                  {profilInfo?.misi?.map((item, index) => (
                    <li key={index}>{item}</li>
                  )) || <li>Memuat misi...</li>}
                </ol>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Struktur Organisasi PPID
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-muted/50">
                  <CardHeader>
                    <CardTitle className="text-base">PPID Utama</CardTitle>
                    <CardDescription>Sekretaris Daerah</CardDescription>
                  </CardHeader>
                </Card>
                <Card className="bg-muted/50">
                  <CardHeader>
                    <CardTitle className="text-base">Atasan PPID</CardTitle>
                    <CardDescription>Bupati Kabupaten Sorong</CardDescription>
                  </CardHeader>
                </Card>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-muted/50">
                  <CardHeader>
                    <CardTitle className="text-sm">PPID Pembantu</CardTitle>
                    <CardDescription className="text-xs">Kepala Dinas/Badan</CardDescription>
                  </CardHeader>
                </Card>
                <Card className="bg-muted/50">
                  <CardHeader>
                    <CardTitle className="text-sm">Tim Pertimbangan</CardTitle>
                    <CardDescription className="text-xs">Pengkajian Keberatan</CardDescription>
                  </CardHeader>
                </Card>
                <Card className="bg-muted/50">
                  <CardHeader>
                    <CardTitle className="text-sm">Petugas Layanan</CardTitle>
                    <CardDescription className="text-xs">Front Office PPID</CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Tugas dan Fungsi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Tugas Pokok</h3>
                  <p className="text-muted-foreground mb-3">
                    {profilInfo?.tugas_pokok || 'Memuat tugas pokok...'}
                  </p>
                </div>
                <Separator />
                <div>
                  <h3 className="font-semibold mb-3">Fungsi</h3>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    {profilInfo?.fungsi?.map((item, index) => (
                      <li key={index}>{item}</li>
                    )) || <li>Memuat fungsi...</li>}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="h-5 w-5 text-primary" />
                Dasar Hukum
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                <li>Undang-Undang Nomor 14 Tahun 2008 tentang Keterbukaan Informasi Publik</li>
                <li>Peraturan Pemerintah Nomor 61 Tahun 2010 tentang Pelaksanaan UU KIP</li>
                <li>Peraturan Komisi Informasi Nomor 1 Tahun 2021 tentang Standar Layanan Informasi Publik</li>
                <li>Peraturan Bupati Sorong tentang Pembentukan PPID Kabupaten Sorong</li>
                <li>Peraturan Bupati Sorong tentang Standar Operasional Prosedur Pelayanan Informasi Publik</li>
              </ol>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
