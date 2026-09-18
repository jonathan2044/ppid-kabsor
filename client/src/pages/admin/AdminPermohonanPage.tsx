import { useState, type ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye, FileText, Save, Search } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { adminFetch } from '@/lib/adminFetch';

type StatusPermohonan = 'menunggu' | 'diproses' | 'selesai' | 'ditolak';

interface Permohonan {
  id: number;
  nomor_registrasi: string;
  nama_pemohon: string;
  alamat: string;
  email: string;
  no_telepon: string;
  pekerjaan: string;
  file_ktp: string;
  rincian_informasi: string;
  tujuan_penggunaan: string;
  cara_memperoleh: string;
  cara_mendapat_salinan: string;
  file_pendukung: string | null;
  status: StatusPermohonan;
  tanggal_permohonan: string;
  tanggal_diproses: string | null;
  tanggal_selesai: string | null;
  file_jawaban: string | null;
  catatan_admin: string | null;
}

const STATUS_TABS: { value: StatusPermohonan; label: string; judul: string; deskripsi: string }[] = [
  { value: 'menunggu', label: 'Menunggu', judul: 'Permohonan Menunggu', deskripsi: 'Permohonan yang menunggu untuk diproses' },
  { value: 'diproses', label: 'Diproses', judul: 'Permohonan Sedang Diproses', deskripsi: 'Permohonan yang sedang dalam proses' },
  { value: 'selesai', label: 'Selesai', judul: 'Permohonan Selesai', deskripsi: 'Permohonan yang telah selesai diproses' },
  { value: 'ditolak', label: 'Ditolak', judul: 'Permohonan Ditolak', deskripsi: 'Permohonan yang ditolak beserta alasannya' },
];

// Sama dengan badge di halaman tracking publik
const STATUS_BADGE: Record<StatusPermohonan, { variant: 'secondary' | 'default' | 'destructive'; className?: string }> = {
  menunggu: { variant: 'secondary' },
  diproses: { variant: 'default' },
  selesai: { variant: 'default', className: 'bg-green-600' },
  ditolak: { variant: 'destructive' },
};

// Nilai opsi dari form permohonan publik (PermohonanPage)
const CARA_LABEL: Record<string, string> = {
  melihat: 'Melihat',
  membaca: 'Membaca',
  mendengar: 'Mendengar',
  mencatat: 'Mencatat',
  mengambil_langsung: 'Mengambil Langsung',
  email: 'Email',
  pos: 'Pos/Kurir',
  faksimili: 'Faksimili',
};

// UU KIP: jawaban paling lambat 10 hari kerja sejak permohonan diterima
// (hari libur nasional belum diperhitungkan)
function batasJawaban(tanggalPermohonan: string) {
  const batas = new Date(tanggalPermohonan);
  let hariKerja = 0;
  while (hariKerja < 10) {
    batas.setDate(batas.getDate() + 1);
    const hari = batas.getDay();
    if (hari !== 0 && hari !== 6) {
      hariKerja++;
    }
  }
  return batas;
}

function formatTanggal(tanggal: string | Date, pola = 'dd MMM yyyy') {
  try {
    return format(new Date(tanggal), pola, { locale: id });
  } catch {
    return '-';
  }
}

function StatusBadge({ status }: { status: StatusPermohonan }) {
  const config = STATUS_BADGE[status];
  const label = STATUS_TABS.find(tab => tab.value === status)?.label ?? status;
  return <Badge variant={config.variant} className={config.className}>{label}</Badge>;
}

function Detail({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-1">
      <p className="text-sm text-muted-foreground">{label}</p>
      <div className="text-sm font-medium whitespace-pre-line break-words">{children}</div>
    </div>
  );
}

function Lampiran({ label, href }: { label: string; href: string }) {
  return (
    <Button variant="outline" size="sm" asChild>
      <a href={href} target="_blank" rel="noopener noreferrer">
        <FileText className="h-4 w-4 mr-2" />
        {label}
      </a>
    </Button>
  );
}

export default function AdminPermohonanPage() {
  const [activeTab, setActiveTab] = useState<StatusPermohonan>('menunggu');
  const [searchQuery, setSearchQuery] = useState('');
  const [selected, setSelected] = useState<Permohonan | null>(null);
  const [formData, setFormData] = useState<{ status: StatusPermohonan; catatan_admin: string }>({
    status: 'menunggu',
    catatan_admin: ''
  });
  const [fileJawaban, setFileJawaban] = useState<File | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: permohonanList = [], isLoading, error } = useQuery<Permohonan[]>({
    queryKey: ['admin-permohonan'],
    queryFn: async () => {
      const response = await adminFetch('/api/permohonan/list?limit=1000');
      if (!response.ok) {
        throw new Error(`Gagal memuat permohonan: ${response.status}`);
      }
      return response.json();
    },
  });

  const openDetail = (permohonan: Permohonan) => {
    setSelected(permohonan);
    setFormData({ status: permohonan.status, catatan_admin: permohonan.catatan_admin ?? '' });
    setFileJawaban(null);
  };

  const closeDetail = () => {
    setSelected(null);
    setFileJawaban(null);
  };

  const updateStatusMutation = useMutation({
    mutationFn: async ({ permohonanId, data }: { permohonanId: number; data: FormData }) => {
      const response = await adminFetch(`/api/permohonan/${permohonanId}/update-status`, {
        method: 'PUT',
        body: data,
      });
      if (!response.ok) {
        throw new Error(`Gagal menyimpan (${response.status})`);
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-permohonan'] });
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard-stats'] });
      toast({ title: 'Permohonan diperbarui' });
      closeDetail();
    },
    onError: (error: Error) => {
      toast({ title: 'Gagal memperbarui permohonan', description: error.message, variant: 'destructive' });
    },
  });

  const handleSave = () => {
    if (!selected) return;

    const data = new FormData();
    data.append('status', formData.status);
    data.append('catatan_admin', formData.catatan_admin);
    if (fileJawaban) {
      data.append('file_jawaban', fileJawaban);
    }
    updateStatusMutation.mutate({ permohonanId: selected.id, data });
  };

  const query = searchQuery.toLowerCase();
  const filteredPermohonan = permohonanList.filter(permohonan =>
    permohonan.status === activeTab &&
    (permohonan.nama_pemohon.toLowerCase().includes(query) ||
      permohonan.nomor_registrasi.toLowerCase().includes(query))
  );
  const countByStatus = (status: StatusPermohonan) =>
    permohonanList.filter(permohonan => permohonan.status === status).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Kelola Permohonan</h1>
        <p className="text-muted-foreground mt-1">Review dan proses permohonan informasi dari masyarakat</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Cari nama pemohon atau nomor registrasi..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
          data-testid="input-search-permohonan"
        />
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as StatusPermohonan)} className="space-y-4">
        <TabsList>
          {STATUS_TABS.map(tab => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
              <Badge variant="secondary" className="ml-2">{countByStatus(tab.value)}</Badge>
            </TabsTrigger>
          ))}
        </TabsList>

        {STATUS_TABS.map(tab => (
          <TabsContent key={tab.value} value={tab.value}>
            <Card>
              <CardHeader>
                <CardTitle>{tab.judul}</CardTitle>
                <CardDescription>{tab.deskripsi}</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <p className="text-sm text-muted-foreground">Memuat data...</p>
                ) : error ? (
                  <p className="text-sm text-destructive">Gagal memuat permohonan. Muat ulang halaman atau login kembali.</p>
                ) : filteredPermohonan.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Tidak ada permohonan.</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>No. Registrasi</TableHead>
                        <TableHead>Pemohon</TableHead>
                        <TableHead>Tanggal Masuk</TableHead>
                        <TableHead>Batas Jawaban</TableHead>
                        <TableHead className="text-right">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPermohonan.map(permohonan => {
                        const batas = batasJawaban(permohonan.tanggal_permohonan);
                        const masihBerjalan = permohonan.status === 'menunggu' || permohonan.status === 'diproses';
                        const lewatBatas = masihBerjalan && batas < new Date();
                        return (
                          <TableRow key={permohonan.id} data-testid={`row-permohonan-${permohonan.id}`}>
                            <TableCell className="font-mono text-sm">{permohonan.nomor_registrasi}</TableCell>
                            <TableCell>
                              <p className="font-medium">{permohonan.nama_pemohon}</p>
                              <p className="text-sm text-muted-foreground line-clamp-1">{permohonan.rincian_informasi}</p>
                            </TableCell>
                            <TableCell>{formatTanggal(permohonan.tanggal_permohonan)}</TableCell>
                            <TableCell className={lewatBatas ? 'text-destructive font-medium' : ''}>
                              {masihBerjalan ? `${formatTanggal(batas)}${lewatBatas ? ' (terlewat)' : ''}` : '-'}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openDetail(permohonan)}
                                data-testid={`button-detail-${permohonan.id}`}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                Detail
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      <Dialog open={selected !== null} onOpenChange={(open) => !open && closeDetail()}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="flex flex-wrap items-center gap-3">
                  <span className="font-mono">{selected.nomor_registrasi}</span>
                  <StatusBadge status={selected.status} />
                </DialogTitle>
                <DialogDescription>
                  Diajukan {formatTanggal(selected.tanggal_permohonan, 'dd MMMM yyyy HH:mm')}
                  {selected.tanggal_diproses && ` · Diproses ${formatTanggal(selected.tanggal_diproses, 'dd MMMM yyyy HH:mm')}`}
                  {selected.tanggal_selesai && ` · Selesai ${formatTanggal(selected.tanggal_selesai, 'dd MMMM yyyy HH:mm')}`}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                <div className="space-y-3">
                  <h3 className="font-semibold">Data Pemohon</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Detail label="Nama">{selected.nama_pemohon}</Detail>
                    <Detail label="Pekerjaan">{selected.pekerjaan}</Detail>
                    <Detail label="Email">
                      <a href={`mailto:${selected.email}`} className="text-primary hover:underline">{selected.email}</a>
                    </Detail>
                    <Detail label="Telepon">{selected.no_telepon}</Detail>
                    <div className="sm:col-span-2">
                      <Detail label="Alamat">{selected.alamat}</Detail>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold">Informasi yang Dimohon</h3>
                  <Detail label="Rincian Informasi">{selected.rincian_informasi}</Detail>
                  <Detail label="Tujuan Penggunaan">{selected.tujuan_penggunaan}</Detail>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Detail label="Cara Memperoleh">
                      {CARA_LABEL[selected.cara_memperoleh] ?? selected.cara_memperoleh}
                    </Detail>
                    <Detail label="Cara Mendapat Salinan">
                      {CARA_LABEL[selected.cara_mendapat_salinan] ?? selected.cara_mendapat_salinan}
                    </Detail>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold">Lampiran</h3>
                  <div className="flex flex-wrap gap-2">
                    <Lampiran label="KTP Pemohon" href={selected.file_ktp} />
                    {selected.file_pendukung && <Lampiran label="Dokumen Pendukung" href={selected.file_pendukung} />}
                    {selected.file_jawaban && <Lampiran label="File Jawaban" href={selected.file_jawaban} />}
                  </div>
                </div>

                <div className="space-y-4 rounded-lg border p-4">
                  <h3 className="font-semibold">Tindak Lanjut</h3>
                  <p className="text-sm text-muted-foreground">
                    Status, catatan, dan file jawaban akan terlihat oleh pemohon di halaman Tracking Permohonan.
                  </p>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as StatusPermohonan }))}
                    >
                      <SelectTrigger id="status" data-testid="select-status">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUS_TABS.map(tab => (
                          <SelectItem key={tab.value} value={tab.value}>{tab.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="catatan_admin">Catatan untuk Pemohon</Label>
                    <Textarea
                      id="catatan_admin"
                      placeholder="Contoh: informasi sedang disiapkan, atau alasan penolakan beserta dasar hukumnya"
                      rows={4}
                      value={formData.catatan_admin}
                      onChange={(e) => setFormData(prev => ({ ...prev, catatan_admin: e.target.value }))}
                      data-testid="input-catatan-admin"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="file_jawaban">File Jawaban {selected.file_jawaban && '(ganti file yang ada)'}</Label>
                    <Input
                      id="file_jawaban"
                      type="file"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={(e) => setFileJawaban(e.target.files?.[0] ?? null)}
                      data-testid="input-file-jawaban"
                    />
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={closeDetail}>Tutup</Button>
                <Button onClick={handleSave} disabled={updateStatusMutation.isPending} data-testid="button-save-permohonan">
                  <Save className="h-4 w-4 mr-2" />
                  {updateStatusMutation.isPending ? 'Menyimpan...' : 'Simpan'}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
