import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Phone, Mail, Clock, Building2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface KontakInfo {
  alamat: string;
  telepon: string;
  fax: string;
  email: string;
  jam_senin_kamis: string;
  jam_jumat: string;
}

export default function KontakPage() {
  const { data: kontakInfo } = useQuery<KontakInfo>({
    queryKey: ['/api/pengaturan/kontak'],
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Hubungi Kami</h1>
            <p className="text-muted-foreground">
              Informasi kontak dan alamat PPID Kabupaten Sorong
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  Alamat Kantor
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium mb-1">PPID Kabupaten Sorong</p>
                    <p className="text-sm text-muted-foreground whitespace-pre-line">
                      {kontakInfo?.alamat || 'Memuat...'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Jam Pelayanan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="font-medium mb-1">Senin - Kamis</p>
                  <p className="text-sm text-muted-foreground">{kontakInfo?.jam_senin_kamis || '08:00 - 16:00 WIT'}</p>
                </div>
                <div>
                  <p className="font-medium mb-1">Jumat</p>
                  <p className="text-sm text-muted-foreground">{kontakInfo?.jam_jumat || '08:00 - 11:30 WIT'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground italic">
                    * Sabtu, Minggu, dan Hari Libur Nasional Tutup
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Informasi Kontak</CardTitle>
              <CardDescription>Hubungi kami melalui saluran berikut</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Telepon</p>
                  <p className="font-medium">{kontakInfo?.telepon || '(0951) 321234'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Fax</p>
                  <p className="font-medium">{kontakInfo?.fax || '(0951) 321235'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{kontakInfo?.email || 'ppid@sorongkab.go.id'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Peta Lokasi</CardTitle>
              <CardDescription>Kantor PPID Kabupaten Sorong</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-video w-full bg-muted rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground text-sm">
                  Peta lokasi akan ditampilkan di sini
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
