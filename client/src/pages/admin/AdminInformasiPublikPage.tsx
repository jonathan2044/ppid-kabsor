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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Pencil, Trash2, Download, Search, FileText, Upload } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { adminFetch } from '@/lib/adminFetch';

interface InformasiPublik {
  id: number;
  judul: string;
  kategori: string;
  deskripsi: string;
  file_dokumen: string;
  tanggal_upload: string;
  jumlah_unduhan: number;
}

const kategoriOptions = [
  { value: 'berkala', label: 'Informasi Berkala' },
  { value: 'serta_merta', label: 'Serta Merta' },
  { value: 'setiap_saat', label: 'Setiap Saat' },
  { value: 'dikecualikan', label: 'Dikecualikan' },
];

export default function AdminInformasiPublikPage() {
  const [activeTab, setActiveTab] = useState('berkala');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDokumen, setSelectedDokumen] = useState<InformasiPublik | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    judul: '',
    kategori: 'berkala',
    deskripsi: ''
  });
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const queryClient = useQueryClient();

  // Fetch informasi publik data
  const { data: dokumenList, isLoading, error } = useQuery<InformasiPublik[]>({
    queryKey: ['admin-informasi-publik', activeTab],
    queryFn: async () => {
      console.log('🔍 [Admin] Fetching informasi publik data for kategori:', activeTab);
      const response = await fetch(`/api/informasi-publik/list?kategori=${activeTab}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch informasi publik: ${response.status}`);
      }
      const data = await response.json();
      console.log('✅ [Admin] Informasi publik data loaded:', data.length, 'items for', activeTab);
      return data;
    },
  });

  // Mutation untuk create informasi publik
  const createInformasiPublikMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await adminFetch('/api/informasi-publik/upload', {
        method: 'POST',
        body: data,
      });
      if (!response.ok) {
        throw new Error('Gagal menambah informasi publik');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-informasi-publik'] });
      setIsDialogOpen(false);
      resetForm();
      console.log('✅ [Admin] Informasi publik created successfully');
    },
  });

  // Mutation untuk update informasi publik
  const updateInformasiPublikMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: FormData }) => {
      const response = await adminFetch(`/api/informasi-publik/${id}`, {
        method: 'PUT',
        body: data,
      });
      if (!response.ok) {
        throw new Error('Gagal mengupdate informasi publik');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-informasi-publik'] });
      setIsDialogOpen(false);
      resetForm();
      console.log('✅ [Admin] Informasi publik updated successfully');
    },
  });

  // Filter dokumen berdasarkan search
  const filteredDokumen = dokumenList?.filter(dokumen =>
    dokumen.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dokumen.deskripsi?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  // Reset form
  const resetForm = () => {
    setFormData({
      judul: '',
      kategori: activeTab,
      deskripsi: ''
    });
    setDocumentFile(null);
    setSelectedDokumen(null);
  };

  // Handle form change
  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle document upload
  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDocumentFile(file);
    }
  };

  // Handle form submit
  const handleSubmit = () => {
    const data = new FormData();
    data.append('judul', formData.judul);
    data.append('kategori', formData.kategori);
    data.append('deskripsi', formData.deskripsi);
    
    if (documentFile) {
      data.append('file_dokumen', documentFile);
    }

    if (selectedDokumen) {
      updateInformasiPublikMutation.mutate({ id: selectedDokumen.id, data });
    } else {
      createInformasiPublikMutation.mutate(data);
    }
  };

  const formatTanggal = (tanggal: string) => {
    try {
      return format(new Date(tanggal), 'dd MMMM yyyy', { locale: id });
    } catch {
      return 'Tanggal tidak valid';
    }
  };

  const getKategoriLabel = (kategori: string) => {
    const option = kategoriOptions.find(opt => opt.value === kategori);
    return option?.label || kategori;
  };

  const handleEdit = (dokumen: InformasiPublik) => {
    console.log('✏️ [Admin] Edit dokumen:', dokumen.id, dokumen.judul);
    setSelectedDokumen(dokumen);
    setFormData({
      judul: dokumen.judul,
      kategori: dokumen.kategori,
      deskripsi: dokumen.deskripsi ?? ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (dokumenId: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus dokumen ini?')) return;
    
    console.log('🗑️ [Admin] Delete dokumen:', dokumenId);
    try {
      const response = await adminFetch(`/api/informasi-publik/${dokumenId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        queryClient.invalidateQueries({ queryKey: ['admin-informasi-publik'] });
        console.log('✅ [Admin] Dokumen deleted successfully');
      } else {
        console.error('❌ [Admin] Failed to delete dokumen');
      }
    } catch (error) {
      console.error('❌ [Admin] Delete error:', error);
    }
  };

  const handleDownload = (dokumen: InformasiPublik) => {
    console.log('📥 [Admin] Download dokumen:', dokumen.judul);
    window.open(dokumen.file_dokumen, '_blank');
  };

  if (error) {
    console.error('❌ [Admin] Informasi publik fetch error:', error);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Kelola Informasi Publik</h1>
          <p className="text-muted-foreground mt-1">Upload dan manage dokumen informasi publik</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()} data-testid="button-add-dokumen">
              <Plus className="h-4 w-4 mr-2" />
              Upload Dokumen
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedDokumen ? 'Edit Dokumen' : 'Upload Dokumen Baru'}</DialogTitle>
              <DialogDescription>
                {selectedDokumen ? 'Edit informasi dokumen' : 'Upload dokumen informasi publik baru'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="judul">Judul Dokumen *</Label>
                <Input
                  id="judul"
                  placeholder="Masukkan judul dokumen"
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
                    {kategoriOptions.map((kategori) => (
                      <SelectItem key={kategori.value} value={kategori.value}>
                        {kategori.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="deskripsi">Deskripsi *</Label>
                <Textarea
                  id="deskripsi"
                  placeholder="Deskripsi dokumen..."
                  rows={4}
                  value={formData.deskripsi}
                  onChange={(e) => handleFormChange('deskripsi', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="file_dokumen">File Dokumen {!selectedDokumen && '*'}</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="file_dokumen"
                    type="file"
                    accept=".pdf,.doc,.docx,.xls,.xlsx"
                    onChange={handleDocumentUpload}
                    className="flex-1"
                  />
                  {(selectedDokumen?.file_dokumen || documentFile) && (
                    <div className="text-sm text-muted-foreground">
                      {documentFile ? documentFile.name : 'File saat ini: ada'}
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Format yang didukung: PDF, DOC, DOCX, XLS, XLSX (Maks 10MB)
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
                  !formData.kategori || 
                  !formData.deskripsi || 
                  (!selectedDokumen && !documentFile) ||
                  createInformasiPublikMutation.isPending ||
                  updateInformasiPublikMutation.isPending
                }
              >
                {createInformasiPublikMutation.isPending || updateInformasiPublikMutation.isPending ? (
                  'Menyimpan...'
                ) : selectedDokumen ? (
                  'Update Dokumen'
                ) : (
                  'Upload Dokumen'
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
              <CardTitle>Dokumen Informasi Publik</CardTitle>
              <CardDescription>
                {isLoading ? 'Memuat data...' : `${filteredDokumen.length} dokumen ditemukan untuk kategori ${getKategoriLabel(activeTab)}`}
              </CardDescription>
            </div>
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari dokumen..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="berkala">Berkala</TabsTrigger>
              <TabsTrigger value="serta_merta">Serta Merta</TabsTrigger>
              <TabsTrigger value="setiap_saat">Setiap Saat</TabsTrigger>
              <TabsTrigger value="dikecualikan">Dikecualikan</TabsTrigger>
            </TabsList>
            
            {['berkala', 'serta_merta', 'setiap_saat', 'dikecualikan'].map((kategori) => (
              <TabsContent key={kategori} value={kategori} className="space-y-4">
                {isLoading ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Memuat data dokumen...</p>
                  </div>
                ) : error ? (
                  <div className="text-center py-8">
                    <p className="text-red-500">Error: Gagal memuat data dokumen</p>
                  </div>
                ) : filteredDokumen.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Belum ada dokumen {getKategoriLabel(kategori)} tersedia</p>
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Judul Dokumen</TableHead>
                          <TableHead>Deskripsi</TableHead>
                          <TableHead>Tanggal Upload</TableHead>
                          <TableHead>Downloads</TableHead>
                          <TableHead className="w-32">Aksi</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredDokumen.map((dokumen) => (
                          <TableRow key={dokumen.id}>
                            <TableCell>
                              <div>
                                <p className="font-medium">{dokumen.judul}</p>
                                <Badge variant="outline" className="mt-1">
                                  {getKategoriLabel(dokumen.kategori)}
                                </Badge>
                              </div>
                            </TableCell>
                            <TableCell>
                              <p className="text-sm text-muted-foreground max-w-xs truncate">
                                {dokumen.deskripsi}
                              </p>
                            </TableCell>
                            <TableCell>{formatTanggal(dokumen.tanggal_upload)}</TableCell>
                            <TableCell>
                              <Badge variant="secondary">{dokumen.jumlah_unduhan} downloads</Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDownload(dokumen)}
                                  title="Download"
                                >
                                  <Download className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEdit(dokumen)}
                                  title="Edit"
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDelete(dokumen.id)}
                                  title="Delete"
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
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
