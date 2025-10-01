import { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Search, FileText, Calendar, User, MapPin, Mail, Phone, Briefcase, Download } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface PermohonanData {
  nomor_registrasi: string;
  nama_pemohon: string;
  alamat: string;
  email: string;
  no_telepon: string;
  pekerjaan: string;
  rincian_informasi: string;
  tujuan_penggunaan: string;
  status: string;
  tanggal_permohonan: string;
  tanggal_diproses?: string;
  tanggal_selesai?: string;
  file_jawaban?: string;
  catatan_admin?: string;
}

export default function TrackingPage() {
  const [nomorRegistrasi, setNomorRegistrasi] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<PermohonanData | null>(null);
  const [error, setError] = useState('');

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setData(null);

    try {
      const response = await fetch(`/api/permohonan/track/${nomorRegistrasi}`);
      
      if (response.ok) {
        const result = await response.json();
        setData(result);
      } else {
        setError('Nomor registrasi tidak ditemukan');
      }
    } catch (err) {
      setError('Terjadi kesalahan. Silakan coba lagi');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      menunggu: { variant: 'secondary' as const, label: 'Menunggu' },
      diproses: { variant: 'default' as const, label: 'Diproses' },
      selesai: { variant: 'default' as const, label: 'Selesai', className: 'bg-green-600' },
      ditolak: { variant: 'destructive' as const, label: 'Ditolak' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.menunggu;
    return <Badge variant={config.variant} className={config.className}>{config.label}</Badge>;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Lacak Permohonan Informasi</h1>
            <p className="text-muted-foreground">
              Masukkan nomor registrasi untuk melihat status permohonan Anda
            </p>
          </div>

          <Card className="mb-8">
            <CardContent className="pt-6">
              <form onSubmit={handleTrack} className="flex gap-4" data-testid="form-tracking">
                <div className="flex-1">
                  <Label htmlFor="nomor_registrasi" className="sr-only">Nomor Registrasi</Label>
                  <Input
                    id="nomor_registrasi"
                    placeholder="Masukkan nomor registrasi (contoh: PPID-20250101120000-1234)"
                    value={nomorRegistrasi}
                    onChange={(e) => setNomorRegistrasi(e.target.value)}
                    required
                    data-testid="input-registration-number"
                  />
                </div>
                <Button type="submit" disabled={loading} data-testid="button-track">
                  <Search className="mr-2 h-4 w-4" />
                  {loading ? 'Mencari...' : 'Lacak'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {error && (
            <Card className="border-destructive mb-8">
              <CardContent className="pt-6">
                <p className="text-destructive text-center" data-testid="text-error">{error}</p>
              </CardContent>
            </Card>
          )}

          {data && (
            <div className="space-y-6" data-testid="container-result">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>Status Permohonan</CardTitle>
                      <CardDescription className="mt-2">
                        <span className="font-mono text-sm" data-testid="text-reg-number">{data.nomor_registrasi}</span>
                      </CardDescription>
                    </div>
                    {getStatusBadge(data.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Tanggal Permohonan</p>
                        <p className="font-medium" data-testid="text-submission-date">
                          {format(new Date(data.tanggal_permohonan), 'dd MMMM yyyy HH:mm', { locale: id })}
                        </p>
                      </div>
                    </div>

                    {data.tanggal_diproses && (
                      <div className="flex items-start gap-3">
                        <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Tanggal Diproses</p>
                          <p className="font-medium">
                            {format(new Date(data.tanggal_diproses), 'dd MMMM yyyy HH:mm', { locale: id })}
                          </p>
                        </div>
                      </div>
                    )}

                    {data.tanggal_selesai && (
                      <div className="flex items-start gap-3">
                        <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Tanggal Selesai</p>
                          <p className="font-medium">
                            {format(new Date(data.tanggal_selesai), 'dd MMMM yyyy HH:mm', { locale: id })}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {data.file_jawaban && (
                    <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg border border-green-200 dark:border-green-800">
                      <p className="text-sm text-green-900 dark:text-green-100 mb-2">Dokumen jawaban tersedia</p>
                      <Button variant="outline" size="sm" asChild className="bg-white dark:bg-green-900" data-testid="button-download-answer">
                        <a href={data.file_jawaban} download>
                          <Download className="mr-2 h-4 w-4" />
                          Unduh Dokumen Jawaban
                        </a>
                      </Button>
                    </div>
                  )}

                  {data.catatan_admin && (
                    <div className="bg-muted p-4 rounded-lg">
                      <p className="text-sm font-medium mb-2">Catatan Admin</p>
                      <p className="text-sm text-muted-foreground" data-testid="text-admin-note">{data.catatan_admin}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Data Pemohon</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Nama</p>
                      <p className="font-medium">{data.nama_pemohon}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Briefcase className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Pekerjaan</p>
                      <p className="font-medium">{data.pekerjaan}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Alamat</p>
                      <p className="font-medium">{data.alamat}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">{data.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Telepon</p>
                        <p className="font-medium">{data.no_telepon}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Rincian Informasi yang Dimohonkan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-2">Informasi yang Dimohonkan</p>
                    <p className="text-sm text-muted-foreground">{data.rincian_informasi}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-2">Tujuan Penggunaan</p>
                    <p className="text-sm text-muted-foreground">{data.tujuan_penggunaan}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
