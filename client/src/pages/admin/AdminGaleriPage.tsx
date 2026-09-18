import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, Search, Image as ImageIcon } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { adminFetch } from '@/lib/adminFetch';

interface Galeri {
  id: number;
  judul: string;
  deskripsi: string;
  file_gambar: string;
  tanggal_upload: string;
}

export default function AdminGaleriPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGaleri, setSelectedGaleri] = useState<Galeri | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    judul: '',
    deskripsi: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const queryClient = useQueryClient();

  // Fetch galeri data
  const { data: galeriList, isLoading, error } = useQuery<Galeri[]>({
    queryKey: ['admin-galeri'],
    queryFn: async () => {
      console.log('🔍 [Admin] Fetching galeri data...');
      const response = await fetch('/api/galeri/list');
      if (!response.ok) {
        throw new Error(`Failed to fetch galeri: ${response.status}`);
      }
      const data = await response.json();
      console.log('✅ [Admin] Galeri data loaded:', data.length, 'items');
      return data;
    },
  });

  // Mutation untuk create galeri
  const createGaleriMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await adminFetch('/api/galeri/upload', {
        method: 'POST',
        body: data,
      });
      if (!response.ok) {
        throw new Error('Gagal menambah foto galeri');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-galeri'] });
      setIsDialogOpen(false);
      resetForm();
      console.log('✅ [Admin] Galeri created successfully');
    },
  });

  // Mutation untuk update galeri
  const updateGaleriMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: FormData }) => {
      const response = await adminFetch(`/api/galeri/${id}`, {
        method: 'PUT',
        body: data,
      });
      if (!response.ok) {
        throw new Error('Gagal mengupdate foto galeri');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-galeri'] });
      setIsDialogOpen(false);
      resetForm();
      console.log('✅ [Admin] Galeri updated successfully');
    },
  });

  // Filter galeri berdasarkan search
  const filteredGaleri = galeriList?.filter(galeri =>
    galeri.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
    galeri.deskripsi?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  // Reset form
  const resetForm = () => {
    setFormData({
      judul: '',
      deskripsi: ''
    });
    setImageFile(null);
    setSelectedGaleri(null);
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
    data.append('deskripsi', formData.deskripsi);
    
    if (imageFile) {
      data.append('file_gambar', imageFile);
    }

    if (selectedGaleri) {
      updateGaleriMutation.mutate({ id: selectedGaleri.id, data });
    } else {
      createGaleriMutation.mutate(data);
    }
  };

  const formatTanggal = (tanggal: string) => {
    try {
      return format(new Date(tanggal), 'dd MMMM yyyy', { locale: id });
    } catch {
      return 'Tanggal tidak valid';
    }
  };

  const handleEdit = (galeri: Galeri) => {
    console.log('✏️ [Admin] Edit galeri:', galeri.id, galeri.judul);
    setSelectedGaleri(galeri);
    setFormData({
      judul: galeri.judul,
      deskripsi: galeri.deskripsi ?? ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (galeriId: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus foto ini?')) return;
    
    console.log('🗑️ [Admin] Delete galeri:', galeriId);
    try {
      const response = await adminFetch(`/api/galeri/${galeriId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        queryClient.invalidateQueries({ queryKey: ['admin-galeri'] });
        console.log('✅ [Admin] Galeri deleted successfully');
      } else {
        console.error('❌ [Admin] Failed to delete galeri');
      }
    } catch (error) {
      console.error('❌ [Admin] Delete error:', error);
    }
  };

  if (error) {
    console.error('❌ [Admin] Galeri fetch error:', error);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Kelola Galeri</h1>
          <p className="text-muted-foreground mt-1">Upload dan manage foto galeri</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()} data-testid="button-add-galeri">
              <Plus className="h-4 w-4 mr-2" />
              Upload Foto
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedGaleri ? 'Edit Foto Galeri' : 'Upload Foto Baru'}</DialogTitle>
              <DialogDescription>
                {selectedGaleri ? 'Edit informasi foto galeri' : 'Upload foto baru ke galeri'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="judul">Judul Foto *</Label>
                <Input
                  id="judul"
                  placeholder="Masukkan judul foto"
                  value={formData.judul}
                  onChange={(e) => handleFormChange('judul', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="deskripsi">Deskripsi</Label>
                <Textarea
                  id="deskripsi"
                  placeholder="Deskripsi foto (opsional)..."
                  rows={3}
                  value={formData.deskripsi}
                  onChange={(e) => handleFormChange('deskripsi', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gambar">Foto {!selectedGaleri && '*'}</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="gambar"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="flex-1"
                  />
                  {(selectedGaleri?.file_gambar || imageFile) && (
                    <div className="text-sm text-muted-foreground">
                      {imageFile ? imageFile.name : 'File saat ini: ada'}
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Format yang didukung: JPG, PNG, GIF, WebP (Maks 5MB)
                </p>
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
                  (!selectedGaleri && !imageFile) ||
                  createGaleriMutation.isPending ||
                  updateGaleriMutation.isPending
                }
              >
                {createGaleriMutation.isPending || updateGaleriMutation.isPending ? (
                  'Menyimpan...'
                ) : selectedGaleri ? (
                  'Update Foto'
                ) : (
                  'Upload Foto'
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
              <CardTitle>Galeri Foto</CardTitle>
              <CardDescription>
                {isLoading ? 'Memuat data...' : `${filteredGaleri.length} foto ditemukan`}
              </CardDescription>
            </div>
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari foto..."
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
              <p className="text-muted-foreground">Memuat galeri foto...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500">Error: Gagal memuat galeri foto</p>
            </div>
          ) : filteredGaleri.length === 0 ? (
            <div className="text-center py-8">
              <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Belum ada foto di galeri</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGaleri.map((galeri) => (
                <Card key={galeri.id} className="overflow-hidden">
                  <div className="aspect-video relative">
                    <img 
                      src={galeri.file_gambar} 
                      alt={galeri.judul}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <h3 className="font-medium line-clamp-2">{galeri.judul}</h3>
                      {galeri.deskripsi && (
                        <p className="text-sm text-muted-foreground line-clamp-3">{galeri.deskripsi}</p>
                      )}
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          {formatTanggal(galeri.tanggal_upload)}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(galeri)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(galeri.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
