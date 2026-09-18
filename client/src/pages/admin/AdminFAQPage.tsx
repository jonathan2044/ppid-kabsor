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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Plus, Pencil, Trash2, Search, HelpCircle, ArrowUp, ArrowDown } from 'lucide-react';
import { adminFetch } from '@/lib/adminFetch';

interface FAQ {
  id: number;
  pertanyaan: string;
  jawaban: string;
  kategori: string;
  urutan: number;
}

const kategoriOptions = [
  { value: 'Umum', label: 'Umum' },
  { value: 'Prosedur', label: 'Prosedur' },
  { value: 'Dokumen', label: 'Dokumen' },
  { value: 'Kontak', label: 'Kontak' },
];

export default function AdminFAQPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFAQ, setSelectedFAQ] = useState<FAQ | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    pertanyaan: '',
    jawaban: '',
    kategori: 'Umum',
    urutan: 1
  });
  const queryClient = useQueryClient();

  // Fetch FAQ data
  const { data: faqList, isLoading, error } = useQuery<FAQ[]>({
    queryKey: ['admin-faq'],
    queryFn: async () => {
      console.log('🔍 [Admin] Fetching FAQ data...');
      const response = await fetch('/api/faq/list');
      if (!response.ok) {
        throw new Error(`Failed to fetch FAQ: ${response.status}`);
      }
      const data = await response.json();
      console.log('✅ [Admin] FAQ data loaded:', data.length, 'items');
      return data;
    },
  });

  // Mutation untuk create FAQ
  const createFAQMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await adminFetch('/api/faq/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Gagal menambah FAQ');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-faq'] });
      setIsDialogOpen(false);
      resetForm();
      console.log('✅ [Admin] FAQ created successfully');
    },
  });

  // Mutation untuk update FAQ
  const updateFAQMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: typeof formData }) => {
      const response = await adminFetch(`/api/faq/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Gagal mengupdate FAQ');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-faq'] });
      setIsDialogOpen(false);
      resetForm();
      console.log('✅ [Admin] FAQ updated successfully');
    },
  });

  // Filter FAQ berdasarkan search
  const filteredFAQ = faqList?.filter(faq =>
    faq.pertanyaan.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.jawaban.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.kategori?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  // Reset form
  const resetForm = () => {
    setFormData({
      pertanyaan: '',
      jawaban: '',
      kategori: 'Umum',
      urutan: 1
    });
    setSelectedFAQ(null);
  };

  // Handle form change
  const handleFormChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle form submit
  const handleSubmit = () => {
    if (selectedFAQ) {
      updateFAQMutation.mutate({ id: selectedFAQ.id, data: formData });
    } else {
      createFAQMutation.mutate(formData);
    }
  };

  // Group FAQ by kategori
  const groupedFAQ = filteredFAQ.reduce((acc, faq) => {
    if (!acc[faq.kategori]) {
      acc[faq.kategori] = [];
    }
    acc[faq.kategori].push(faq);
    return acc;
  }, {} as Record<string, FAQ[]>);

  const handleEdit = (faq: FAQ) => {
    console.log('✏️ [Admin] Edit FAQ:', faq.id, faq.pertanyaan.substring(0, 30));
    setSelectedFAQ(faq);
    setFormData({
      pertanyaan: faq.pertanyaan,
      jawaban: faq.jawaban,
      kategori: faq.kategori,
      urutan: faq.urutan
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (faqId: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus FAQ ini?')) return;
    
    console.log('🗑️ [Admin] Delete FAQ:', faqId);
    try {
      const response = await adminFetch(`/api/faq/${faqId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        queryClient.invalidateQueries({ queryKey: ['admin-faq'] });
        console.log('✅ [Admin] FAQ deleted successfully');
      } else {
        console.error('❌ [Admin] Failed to delete FAQ');
      }
    } catch (error) {
      console.error('❌ [Admin] Delete error:', error);
    }
  };

  const handleMoveUp = async (faq: FAQ) => {
    console.log('⬆️ [Admin] Move FAQ up:', faq.id);
    // Implementation for reordering would go here
  };

  const handleMoveDown = async (faq: FAQ) => {
    console.log('⬇️ [Admin] Move FAQ down:', faq.id);
    // Implementation for reordering would go here
  };

  if (error) {
    console.error('❌ [Admin] FAQ fetch error:', error);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Kelola FAQ</h1>
          <p className="text-muted-foreground mt-1">Tambah, edit, dan hapus FAQ</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()} data-testid="button-add-faq">
              <Plus className="h-4 w-4 mr-2" />
              Tambah FAQ
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedFAQ ? 'Edit FAQ' : 'Tambah FAQ Baru'}</DialogTitle>
              <DialogDescription>
                {selectedFAQ ? 'Edit pertanyaan dan jawaban FAQ' : 'Tambahkan FAQ baru untuk membantu masyarakat'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
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
                  <Label htmlFor="urutan">Urutan</Label>
                  <Input
                    id="urutan"
                    type="number"
                    min="1"
                    placeholder="1"
                    value={formData.urutan}
                    onChange={(e) => handleFormChange('urutan', parseInt(e.target.value) || 1)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pertanyaan">Pertanyaan *</Label>
                <Textarea
                  id="pertanyaan"
                  placeholder="Tulis pertanyaan yang sering ditanyakan..."
                  rows={3}
                  value={formData.pertanyaan}
                  onChange={(e) => handleFormChange('pertanyaan', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="jawaban">Jawaban *</Label>
                <Textarea
                  id="jawaban"
                  placeholder="Tulis jawaban yang lengkap dan jelas..."
                  rows={6}
                  value={formData.jawaban}
                  onChange={(e) => handleFormChange('jawaban', e.target.value)}
                />
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
                  !formData.pertanyaan || 
                  !formData.jawaban || 
                  !formData.kategori ||
                  createFAQMutation.isPending ||
                  updateFAQMutation.isPending
                }
              >
                {createFAQMutation.isPending || updateFAQMutation.isPending ? (
                  'Menyimpan...'
                ) : selectedFAQ ? (
                  'Update FAQ'
                ) : (
                  'Tambah FAQ'
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
              <CardTitle>Daftar FAQ</CardTitle>
              <CardDescription>
                {isLoading ? 'Memuat data...' : `${filteredFAQ.length} FAQ ditemukan`}
              </CardDescription>
            </div>
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari FAQ..."
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
              <p className="text-muted-foreground">Memuat data FAQ...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500">Error: Gagal memuat data FAQ</p>
            </div>
          ) : filteredFAQ.length === 0 ? (
            <div className="text-center py-8">
              <HelpCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Belum ada FAQ tersedia</p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedFAQ).map(([kategori, faqs]) => (
                <div key={kategori} className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-semibold">
                      {kategori}
                    </Badge>
                    <span className="text-sm text-muted-foreground">({faqs.length} pertanyaan)</span>
                  </div>
                  
                  <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq) => (
                      <AccordionItem key={faq.id} value={`faq-${faq.id}`}>
                        <AccordionTrigger className="text-left">
                          <div className="flex items-center justify-between w-full pr-4">
                            <span>{faq.pertanyaan}</span>
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMoveUp(faq);
                                }}
                                title="Pindah ke atas"
                              >
                                <ArrowUp className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMoveDown(faq);
                                }}
                                title="Pindah ke bawah"
                              >
                                <ArrowDown className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEdit(faq);
                                }}
                                title="Edit"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(faq.id);
                                }}
                                title="Delete"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pt-4">
                          <div className="space-y-4">
                            <p className="text-muted-foreground">{faq.jawaban}</p>
                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                              <span>Urutan: {faq.urutan}</span>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEdit(faq)}
                                >
                                  <Pencil className="h-4 w-4 mr-2" />
                                  Edit
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDelete(faq.id)}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Hapus
                                </Button>
                              </div>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
