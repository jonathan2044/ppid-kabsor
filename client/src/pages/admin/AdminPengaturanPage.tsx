import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Save, MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { adminFetch } from '@/lib/adminFetch';

// Bentuk data mengikuti /api/pengaturan/* (juga dipakai Hero, KontakPage, ProfilPPIDPage)
interface HeroSettings {
  title: string;
  subtitle: string;
  bg_image: string;
}

interface KontakSettings {
  alamat: string;
  telepon: string;
  fax: string;
  email: string;
  jam_senin_kamis: string;
  jam_jumat: string;
}

interface ProfilSettings {
  tentang: string;
  visi: string;
  misi: string[];
  tugas_pokok: string;
  fungsi: string[];
}

// Di form, misi & fungsi diedit sebagai teks: satu butir per baris
interface ProfilForm {
  tentang: string;
  visi: string;
  misi: string;
  tugas_pokok: string;
  fungsi: string;
}

const toLines = (text: string) => text.split('\n').map(line => line.trim()).filter(Boolean);

export default function AdminPengaturanPage() {
  const [heroData, setHeroData] = useState<HeroSettings>({
    title: '',
    subtitle: '',
    bg_image: ''
  });
  const [kontakData, setKontakData] = useState<KontakSettings>({
    alamat: '',
    telepon: '',
    fax: '',
    email: '',
    jam_senin_kamis: '',
    jam_jumat: ''
  });
  const [profilData, setProfilData] = useState<ProfilForm>({
    tentang: '',
    visi: '',
    misi: '',
    tugas_pokok: '',
    fungsi: ''
  });

  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch hero settings
  const { isLoading: heroLoading } = useQuery<HeroSettings>({
    queryKey: ['pengaturan-hero'],
    queryFn: async () => {
      const response = await fetch('/api/pengaturan/hero');
      if (!response.ok) {
        throw new Error('Failed to fetch hero settings');
      }
      const data = await response.json();
      setHeroData(data);
      return data;
    },
  });

  // Fetch kontak settings
  const { isLoading: kontakLoading } = useQuery<KontakSettings>({
    queryKey: ['pengaturan-kontak'],
    queryFn: async () => {
      const response = await fetch('/api/pengaturan/kontak');
      if (!response.ok) {
        throw new Error('Failed to fetch kontak settings');
      }
      const data = await response.json();
      setKontakData(data);
      return data;
    },
  });

  // Fetch profil settings
  const { isLoading: profilLoading } = useQuery<ProfilSettings>({
    queryKey: ['pengaturan-profil'],
    queryFn: async () => {
      const response = await fetch('/api/pengaturan/profil');
      if (!response.ok) {
        throw new Error('Failed to fetch profil settings');
      }
      const data: ProfilSettings = await response.json();
      setProfilData({ ...data, misi: data.misi.join('\n'), fungsi: data.fungsi.join('\n') });
      return data;
    },
  });

  const saveSettings = async (section: 'hero' | 'kontak' | 'profil', data: unknown) => {
    const response = await adminFetch(`/api/pengaturan/${section}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Gagal menyimpan (${response.status})`);
    }
    return response.json();
  };

  // Admin & halaman publik memakai query key berbeda; keduanya perlu di-refresh
  const onSaved = (section: 'hero' | 'kontak' | 'profil') => () => {
    queryClient.invalidateQueries({ queryKey: [`pengaturan-${section}`] });
    queryClient.invalidateQueries({ queryKey: [`/api/pengaturan/${section}`] });
    toast({ title: 'Perubahan disimpan' });
  };

  const onSaveError = (error: Error) => {
    toast({ title: 'Gagal menyimpan', description: error.message, variant: 'destructive' });
  };

  const updateHeroMutation = useMutation({
    mutationFn: (data: HeroSettings) => saveSettings('hero', data),
    onSuccess: onSaved('hero'),
    onError: onSaveError,
  });

  const updateKontakMutation = useMutation({
    mutationFn: (data: KontakSettings) => saveSettings('kontak', data),
    onSuccess: onSaved('kontak'),
    onError: onSaveError,
  });

  const updateProfilMutation = useMutation({
    mutationFn: (data: ProfilForm) =>
      saveSettings('profil', { ...data, misi: toLines(data.misi), fungsi: toLines(data.fungsi) }),
    onSuccess: onSaved('profil'),
    onError: onSaveError,
  });

  const handleHeroSubmit = () => {
    updateHeroMutation.mutate(heroData);
  };

  const handleKontakSubmit = () => {
    updateKontakMutation.mutate(kontakData);
  };

  const handleProfilSubmit = () => {
    updateProfilMutation.mutate(profilData);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Pengaturan Website</h1>
        <p className="text-muted-foreground mt-1">Kelola konten dinamis website PPID</p>
      </div>

      <Tabs defaultValue="hero" className="space-y-4">
        <TabsList>
          <TabsTrigger value="hero">Hero Section</TabsTrigger>
          <TabsTrigger value="kontak">Kontak</TabsTrigger>
          <TabsTrigger value="profil">Profil PPID</TabsTrigger>
        </TabsList>

        <TabsContent value="hero" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Hero Section</CardTitle>
              <CardDescription>Kelola konten hero section homepage</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {heroLoading ? (
                <p className="text-muted-foreground">Memuat data...</p>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="title">Judul Utama</Label>
                    <Input
                      id="title"
                      placeholder="Judul utama hero section"
                      value={heroData.title}
                      onChange={(e) => setHeroData(prev => ({ ...prev, title: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subtitle">Sub Judul</Label>
                    <Textarea
                      id="subtitle"
                      placeholder="Sub judul hero section"
                      rows={2}
                      value={heroData.subtitle}
                      onChange={(e) => setHeroData(prev => ({ ...prev, subtitle: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bg_image">URL Gambar Latar</Label>
                    <Input
                      id="bg_image"
                      placeholder="https://..."
                      value={heroData.bg_image}
                      onChange={(e) => setHeroData(prev => ({ ...prev, bg_image: e.target.value }))}
                    />
                  </div>

                  <Button
                    onClick={handleHeroSubmit}
                    disabled={updateHeroMutation.isPending}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {updateHeroMutation.isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="kontak" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Kontak</CardTitle>
              <CardDescription>Kelola informasi kontak PPID</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {kontakLoading ? (
                <p className="text-muted-foreground">Memuat data...</p>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="alamat" className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Alamat
                    </Label>
                    <Textarea
                      id="alamat"
                      placeholder="Alamat lengkap kantor PPID"
                      rows={4}
                      value={kontakData.alamat}
                      onChange={(e) => setKontakData(prev => ({ ...prev, alamat: e.target.value }))}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="telepon" className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Telepon
                      </Label>
                      <Input
                        id="telepon"
                        placeholder="Nomor telepon"
                        value={kontakData.telepon}
                        onChange={(e) => setKontakData(prev => ({ ...prev, telepon: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="fax" className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Fax
                      </Label>
                      <Input
                        id="fax"
                        placeholder="Nomor fax"
                        value={kontakData.fax}
                        onChange={(e) => setKontakData(prev => ({ ...prev, fax: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Email resmi"
                      value={kontakData.email}
                      onChange={(e) => setKontakData(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="jam_senin_kamis" className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Jam Layanan Senin - Kamis
                      </Label>
                      <Input
                        id="jam_senin_kamis"
                        placeholder="Contoh: 08:00 - 16:00 WIT"
                        value={kontakData.jam_senin_kamis}
                        onChange={(e) => setKontakData(prev => ({ ...prev, jam_senin_kamis: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="jam_jumat" className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Jam Layanan Jumat
                      </Label>
                      <Input
                        id="jam_jumat"
                        placeholder="Contoh: 08:00 - 11:30 WIT"
                        value={kontakData.jam_jumat}
                        onChange={(e) => setKontakData(prev => ({ ...prev, jam_jumat: e.target.value }))}
                      />
                    </div>
                  </div>

                  <Button
                    onClick={handleKontakSubmit}
                    disabled={updateKontakMutation.isPending}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {updateKontakMutation.isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profil" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profil PPID</CardTitle>
              <CardDescription>Kelola profil, visi, misi, tugas, dan fungsi PPID</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {profilLoading ? (
                <p className="text-muted-foreground">Memuat data...</p>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="tentang">Tentang PPID</Label>
                    <Textarea
                      id="tentang"
                      placeholder="Deskripsi tentang PPID Kabupaten Sorong"
                      rows={4}
                      value={profilData.tentang}
                      onChange={(e) => setProfilData(prev => ({ ...prev, tentang: e.target.value }))}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="visi">Visi</Label>
                      <Textarea
                        id="visi"
                        placeholder="Visi PPID"
                        rows={6}
                        value={profilData.visi}
                        onChange={(e) => setProfilData(prev => ({ ...prev, visi: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="misi">Misi (satu butir per baris)</Label>
                      <Textarea
                        id="misi"
                        placeholder="Misi PPID"
                        rows={6}
                        value={profilData.misi}
                        onChange={(e) => setProfilData(prev => ({ ...prev, misi: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="tugas_pokok">Tugas Pokok PPID</Label>
                      <Textarea
                        id="tugas_pokok"
                        placeholder="Tugas pokok PPID"
                        rows={7}
                        value={profilData.tugas_pokok}
                        onChange={(e) => setProfilData(prev => ({ ...prev, tugas_pokok: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="fungsi">Fungsi PPID (satu butir per baris)</Label>
                      <Textarea
                        id="fungsi"
                        placeholder="Fungsi PPID"
                        rows={7}
                        value={profilData.fungsi}
                        onChange={(e) => setProfilData(prev => ({ ...prev, fungsi: e.target.value }))}
                      />
                    </div>
                  </div>

                  <Button
                    onClick={handleProfilSubmit}
                    disabled={updateProfilMutation.isPending}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {updateProfilMutation.isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
