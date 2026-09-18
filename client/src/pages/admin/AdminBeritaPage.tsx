import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, Eye, Search, Upload } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { adminFetch } from '@/lib/adminFetch';

interface Berita {
  id: number;
  judul: string;
  slug: string;
  kategori: string;
  konten: string;
  gambar: string;
  penulis: string;
  tanggal_publikasi: string;
  views: number;
}

export default function AdminBeritaPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBerita, setSelectedBerita] = useState<Berita | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    judul: '',
    kategori: '',
    konten: '',
    penulis: '',
    gambar: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const queryClient = useQueryClient();

  // Fetch berita data
  const { data: beritaList, isLoading, error } = useQuery<Berita[]>({
    queryKey: ['admin-berita'],
    queryFn: async () => {
      console.log('🔍 [Admin] Fetching berita data...');
      const response = await fetch('/api/berita/list');
      if (!response.ok) {
        throw new Error(`Failed to fetch berita: ${response.status}`);
      }
      const data = await response.json();
      console.log('✅ [Admin] Berita data loaded:', data.length, 'items');
      return data;
    },
  });

  // Mutation untuk create berita
  const createBeritaMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await adminFetch('/api/berita/create', {
        method: 'POST',
        body: data,
      });
      if (!response.ok) {
        throw new Error('Gagal menambah berita');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-berita'] });
      setIsDialogOpen(false);
      resetForm();
      console.log('✅ [Admin] Berita created successfully');
    },
  });

  // Mutation untuk update berita
  const updateBeritaMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: FormData }) => {
      const response = await adminFetch(`/api/berita/${id}`, {
        method: 'PUT',
        body: data,
      });
      if (!response.ok) {
        throw new Error('Gagal mengupdate berita');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-berita'] });
      setIsDialogOpen(false);
      resetForm();
      console.log('✅ [Admin] Berita updated successfully');
    },
  });

  // Filter berita berdasirkan search
  const filteredBerita = beritaList?.filter(berita =>
    berita.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
    berita.penulis?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  // Reset form
  const resetForm = () => {
    setFormData({
      judul: '',
      kategori: '',
      konten: '',
      penulis: '',
      gambar: ''
    });
    setImageFile(null);
    setSelectedBerita(null);
  };

  // Handle form change
  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  // Handle form submit
  const handleSubmit = () => {
    const data = new FormData();
    data.append('judul', formData.judul);
    data.append('kategori', formData.kategori);
    data.append('konten', formData.konten);
    data.append('penulis', formData.penulis);
    
    if (imageFile) {
      data.append('gambar', imageFile);
    }

    if (selectedBerita) {
      updateBeritaMutation.mutate({ id: selectedBerita.id, data });
    } else {
      createBeritaMutation.mutate(data);
    }
  };

  const formatTanggal = (tanggal: string) => {
    try {
      return format(new Date(tanggal), 'dd MMMM yyyy', { locale: id });
    } catch {
      return 'Tanggal tidak valid';
    }
  };

  const handleEdit = (berita: Berita) => {
    console.log('✏️ [Admin] Edit berita:', berita.id, berita.judul);
    setSelectedBerita(berita);
    setFormData({
      judul: berita.judul,
      kategori: berita.kategori,
      konten: berita.konten,
      penulis: berita.penulis,
      gambar: berita.gambar
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (beritaId: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus berita ini?')) return;
    
    console.log('🗑️ [Admin] Delete berita:', beritaId);
    try {
      const response = await adminFetch(`/api/berita/${beritaId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        queryClient.invalidateQueries({ queryKey: ['admin-berita'] });
        console.log('✅ [Admin] Berita deleted successfully');
      } else {
        console.error('❌ [Admin] Failed to delete berita');
      }
    } catch (error) {
      console.error('❌ [Admin] Delete error:', error);
    }
  };

  if (error) {
    console.error('❌ [Admin] Berita fetch error:', error);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Kelola Berita</h1>
          <p className="text-muted-foreground mt-1">Tambah, edit, dan hapus berita</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()} data-testid="button-add-berita">
              <Plus className="h-4 w-4 mr-2" />
              Tambah Berita
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedBerita ? 'Edit Berita' : 'Tambah Berita Baru'}</DialogTitle>
              <DialogDescription>
                {selectedBerita ? 'Edit informasi berita' : 'Tambahkan berita baru ke website'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="judul">Judul Berita *</Label>
                  <Input
                    id="judul"
                    placeholder="Masukkan judul berita"
                    value={formData.judul}
                    onChange={(e) => handleFormChange('judul', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="kategori">Kategori *</Label>
                  <Select value={formData.kategori} onValueChange={(value) => handleFormChange('kategori', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Berita">Berita</SelectItem>
                      <SelectItem value="Pengumuman">Pengumuman</SelectItem>
                      <SelectItem value="Agenda">Agenda</SelectItem>
                      <SelectItem value="Press Release">Press Release</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="penulis">Penulis *</Label>
                <Input
                  id="penulis"
                  placeholder="Nama penulis"
                  value={formData.penulis}
                  onChange={(e) => handleFormChange('penulis', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="konten">Konten Berita *</Label>
                <Textarea
                  id="konten"
                  placeholder="Tulis konten berita..."
                  rows={8}
                  value={formData.konten}
                  onChange={(e) => handleFormChange('konten', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gambar">Gambar Utama</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="gambar"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="flex-1"
                  />
                  {(formData.gambar || imageFile) && (
                    <div className="text-sm text-muted-foreground">
                      {imageFile ? imageFile.name : 'File saat ini: ada'}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Batal
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={
                  !formData.judul || 
                  !formData.kategori || 
                  !formData.konten || 
                  !formData.penulis ||
                  createBeritaMutation.isPending ||
                  updateBeritaMutation.isPending
                }
              >
                {createBeritaMutation.isPending || updateBeritaMutation.isPending ? (
                  'Menyimpan...'
                ) : selectedBerita ? (
                  'Update Berita'
                ) : (
                  'Tambah Berita'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Daftar Berita</CardTitle>
              <CardDescription>
                {isLoading ? 'Memuat data...' : `${filteredBerita.length} berita ditemukan`}
              </CardDescription>
            </div>
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari berita..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Memuat data berita...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500">Error: Gagal memuat data berita</p>
            </div>
          ) : filteredBerita.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Belum ada berita tersedia</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Judul</TableHead>
                    <TableHead>Penulis</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Views</TableHead>
                    <TableHead className="w-32">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBerita.map((berita) => (
                    <TableRow key={berita.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{berita.judul}</p>
                          <p className="text-sm text-muted-foreground">{berita.slug}</p>
                        </div>
                      </TableCell>
                      <TableCell>{berita.penulis}</TableCell>
                      <TableCell>{formatTanggal(berita.tanggal_publikasi)}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{berita.views} views</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(berita)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(berita.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
