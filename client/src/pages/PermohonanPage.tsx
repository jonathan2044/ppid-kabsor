import { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { FileText, Upload, CheckCircle } from 'lucide-react';

export default function PermohonanPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [nomorRegistrasi, setNomorRegistrasi] = useState('');
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);

    try {
      const response = await fetch('/api/permohonan/submit', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setNomorRegistrasi(data.nomor_registrasi);
        setSubmitted(true);
        toast({
          title: "Permohonan Berhasil Dikirim",
          description: `Nomor registrasi Anda: ${data.nomor_registrasi}`,
        });
      } else {
        throw new Error('Gagal mengirim permohonan');
      }
    } catch (error) {
      toast({
        title: "Gagal Mengirim Permohonan",
        description: "Silakan coba lagi nanti",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-12">
          <Card className="max-w-2xl mx-auto text-center" data-testid="card-submission-success">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-16 w-16 text-green-600" />
              </div>
              <CardTitle className="text-2xl">Permohonan Berhasil Dikirim!</CardTitle>
              <CardDescription>
                Permohonan informasi Anda telah kami terima
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted p-6 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">Nomor Registrasi Anda</p>
                <p className="text-2xl font-bold text-primary" data-testid="text-registration-number">{nomorRegistrasi}</p>
              </div>
              <p className="text-sm text-muted-foreground">
                Simpan nomor registrasi ini untuk melacak status permohonan Anda
              </p>
              <div className="flex gap-4 justify-center pt-4">
                <Button onClick={() => window.location.href = `/tracking?nomor=${nomorRegistrasi}`} data-testid="button-track">
                  <FileText className="mr-2 h-4 w-4" />
                  Lacak Permohonan
                </Button>
                <Button variant="outline" onClick={() => window.location.href = '/'} data-testid="button-home">
                  Kembali ke Beranda
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Form Permohonan Informasi Publik</h1>
            <p className="text-muted-foreground">
              Isi formulir di bawah ini untuk mengajukan permohonan informasi publik sesuai UU KIP
            </p>
          </div>

          <form onSubmit={handleSubmit} data-testid="form-permohonan">
            <Card>
              <CardHeader>
                <CardTitle>Data Pemohon</CardTitle>
                <CardDescription>Lengkapi data diri Anda dengan benar</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nama_pemohon">Nama Lengkap *</Label>
                    <Input id="nama_pemohon" name="nama_pemohon" required data-testid="input-name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pekerjaan">Pekerjaan *</Label>
                    <Input id="pekerjaan" name="pekerjaan" required data-testid="input-job" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="alamat">Alamat *</Label>
                  <Textarea id="alamat" name="alamat" required rows={3} data-testid="input-address" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input id="email" name="email" type="email" required data-testid="input-email" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="no_telepon">No. Telepon/HP *</Label>
                    <Input id="no_telepon" name="no_telepon" required data-testid="input-phone" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="file_ktp">Upload KTP *</Label>
                  <Input id="file_ktp" name="file_ktp" type="file" accept="image/*,.pdf" required data-testid="input-ktp" />
                  <p className="text-xs text-muted-foreground">Format: JPG, PNG, atau PDF (Maks. 2MB)</p>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Rincian Informasi yang Dimohonkan</CardTitle>
                <CardDescription>Jelaskan informasi yang Anda butuhkan</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="rincian_informasi">Rincian Informasi *</Label>
                  <Textarea
                    id="rincian_informasi"
                    name="rincian_informasi"
                    required
                    rows={5}
                    placeholder="Jelaskan secara detail informasi yang Anda perlukan..."
                    data-testid="input-information-detail"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tujuan_penggunaan">Tujuan Penggunaan Informasi *</Label>
                  <Textarea
                    id="tujuan_penggunaan"
                    name="tujuan_penggunaan"
                    required
                    rows={3}
                    placeholder="Jelaskan tujuan penggunaan informasi..."
                    data-testid="input-purpose"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cara_memperoleh">Cara Memperoleh Informasi *</Label>
                    <Select name="cara_memperoleh" required>
                      <SelectTrigger data-testid="select-obtain-method">
                        <SelectValue placeholder="Pilih cara..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="melihat">Melihat</SelectItem>
                        <SelectItem value="membaca">Membaca</SelectItem>
                        <SelectItem value="mendengar">Mendengar</SelectItem>
                        <SelectItem value="mencatat">Mencatat</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cara_mendapat_salinan">Cara Mendapatkan Salinan *</Label>
                    <Select name="cara_mendapat_salinan" required>
                      <SelectTrigger data-testid="select-copy-method">
                        <SelectValue placeholder="Pilih cara..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mengambil_langsung">Mengambil Langsung</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="pos">Pos/Kurir</SelectItem>
                        <SelectItem value="faksimili">Faksimili</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="file_pendukung">Dokumen Pendukung (Opsional)</Label>
                  <Input id="file_pendukung" name="file_pendukung" type="file" accept=".pdf,.doc,.docx" data-testid="input-supporting-doc" />
                  <p className="text-xs text-muted-foreground">Format: PDF, DOC, DOCX (Maks. 5MB)</p>
                </div>
              </CardContent>
            </Card>

            <div className="mt-6 flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => window.location.href = '/'} data-testid="button-cancel">
                Batal
              </Button>
              <Button type="submit" disabled={isSubmitting} data-testid="button-submit">
                {isSubmitting ? (
                  <>Mengirim...</>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Kirim Permohonan
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
