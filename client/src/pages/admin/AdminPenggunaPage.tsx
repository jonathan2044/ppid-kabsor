import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { KeyRound, Plus, Pencil, Trash2, Users, Wand2, Eye, EyeOff } from 'lucide-react';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { adminFetch } from '@/lib/adminFetch';
import { useToast } from '@/hooks/use-toast';

const PASSWORD_MIN = 10;

interface Pengguna {
  id: number;
  username: string;
  email: string;
  nama_lengkap: string;
  role: 'admin' | 'operator';
  is_active: boolean;
  created_at: string;
}

/** Ambil pesan kesalahan dari respons FastAPI (detail bisa string atau daftar galat validasi). */
async function pesanGagal(response: Response, cadangan: string) {
  try {
    const body = await response.json();
    if (typeof body?.detail === 'string') return body.detail;
    if (Array.isArray(body?.detail)) {
      const pesan = body.detail.map((d: { msg?: string }) => d.msg).filter(Boolean).join('; ');
      if (pesan) return pesan;
    }
  } catch {
    // respons tanpa JSON (mis. 204) — pakai pesan cadangan
  }
  return cadangan;
}

/** Password acak yang kuat, dibuat di peramban dengan generator acak kriptografis. */
function buatPassword(panjang = 16) {
  const abjad = 'abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const acak = new Uint32Array(panjang);
  crypto.getRandomValues(acak);
  return Array.from(acak, (n) => abjad[n % abjad.length]).join('');
}

function formatTanggal(tanggal: string) {
  try {
    return format(new Date(tanggal), 'd MMM yyyy', { locale: localeId });
  } catch {
    return '-';
  }
}

/** Kolom password dengan tombol lihat/sembunyikan dan tombol buat otomatis. */
function KolomPassword({
  id,
  value,
  onChange,
  placeholder,
  withGenerator = false,
  autoComplete = 'new-password',
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  withGenerator?: boolean;
  autoComplete?: string;
}) {
  const [terlihat, setTerlihat] = useState(false);
  return (
    <div className="flex gap-2">
      <div className="relative flex-1">
        <Input
          id={id}
          type={terlihat ? 'text' : 'password'}
          value={value}
          placeholder={placeholder}
          autoComplete={autoComplete}
          onChange={(e) => onChange(e.target.value)}
          className="pr-10"
          data-testid={`input-${id}`}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="!absolute right-0 top-0 h-full w-10 hover:bg-transparent"
          onClick={() => setTerlihat((v) => !v)}
          aria-label={terlihat ? 'Sembunyikan password' : 'Tampilkan password'}
        >
          {terlihat ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </Button>
      </div>
      {withGenerator && (
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            onChange(buatPassword());
            setTerlihat(true);
          }}
          title="Buat password acak"
        >
          <Wand2 className="h-4 w-4 mr-2" />
          Buatkan
        </Button>
      )}
    </div>
  );
}

/** Ganti password sendiri. Tersedia untuk admin maupun operator. */
function KartuPasswordSaya() {
  const { toast } = useToast();
  const [form, setForm] = useState({ lama: '', baru: '', ulangi: '' });

  const gantiPassword = useMutation({
    mutationFn: async () => {
      const response = await adminFetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password_lama: form.lama, password_baru: form.baru }),
      });
      if (!response.ok) {
        throw new Error(await pesanGagal(response, 'Gagal mengganti password'));
      }
    },
    onSuccess: () => {
      setForm({ lama: '', baru: '', ulangi: '' });
      toast({ title: 'Password berhasil diganti', description: 'Gunakan password baru saat login berikutnya.' });
    },
    onError: (error: Error) => {
      toast({ variant: 'destructive', title: 'Gagal mengganti password', description: error.message });
    },
  });

  const terlaluPendek = form.baru.length > 0 && form.baru.length < PASSWORD_MIN;
  const tidakSama = form.ulangi.length > 0 && form.baru !== form.ulangi;
  const siap =
    form.lama.length > 0 && form.baru.length >= PASSWORD_MIN && form.baru === form.ulangi;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <KeyRound className="h-5 w-5" />
          Password Saya
        </CardTitle>
        <CardDescription>
          Ganti password akun Anda sendiri. Minimal {PASSWORD_MIN} karakter.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="grid gap-4 max-w-xl"
          onSubmit={(e) => {
            e.preventDefault();
            if (siap) gantiPassword.mutate();
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="password-lama">Password sekarang</Label>
            <KolomPassword
              id="password-lama"
              value={form.lama}
              autoComplete="current-password"
              onChange={(v) => setForm((f) => ({ ...f, lama: v }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password-baru">Password baru</Label>
            <KolomPassword
              id="password-baru"
              value={form.baru}
              withGenerator
              onChange={(v) => setForm((f) => ({ ...f, baru: v }))}
            />
            {terlaluPendek && (
              <p className="text-sm text-destructive">Minimal {PASSWORD_MIN} karakter.</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password-ulangi">Ulangi password baru</Label>
            <KolomPassword
              id="password-ulangi"
              value={form.ulangi}
              onChange={(v) => setForm((f) => ({ ...f, ulangi: v }))}
            />
            {tidakSama && <p className="text-sm text-destructive">Ulangan password belum sama.</p>}
          </div>
          <div>
            <Button type="submit" disabled={!siap || gantiPassword.isPending} data-testid="button-ganti-password">
              {gantiPassword.isPending ? 'Menyimpan...' : 'Ganti Password'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default function AdminPenggunaPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isAdmin = user?.role === 'admin';

  const [dialogTambah, setDialogTambah] = useState(false);
  const [formTambah, setFormTambah] = useState({
    username: '',
    email: '',
    nama_lengkap: '',
    role: 'operator' as 'admin' | 'operator',
    password: '',
  });

  const [sedangDiedit, setSedangDiedit] = useState<Pengguna | null>(null);
  const [formEdit, setFormEdit] = useState({
    nama_lengkap: '',
    email: '',
    role: 'operator' as 'admin' | 'operator',
    is_active: true,
  });

  const [sedangDireset, setSedangDireset] = useState<Pengguna | null>(null);
  const [passwordReset, setPasswordReset] = useState('');

  const [akanDihapus, setAkanDihapus] = useState<Pengguna | null>(null);

  const { data: daftar, isLoading, isError } = useQuery<Pengguna[]>({
    queryKey: ['admin-pengguna'],
    enabled: isAdmin,
    queryFn: async () => {
      const response = await adminFetch('/api/auth/users');
      if (!response.ok) {
        throw new Error(await pesanGagal(response, 'Gagal memuat daftar pengguna'));
      }
      return response.json();
    },
  });

  const segarkan = () => queryClient.invalidateQueries({ queryKey: ['admin-pengguna'] });

  const tambahPengguna = useMutation({
    mutationFn: async () => {
      const response = await adminFetch('/api/auth/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formTambah, username: formTambah.username.trim().toLowerCase() }),
      });
      if (!response.ok) {
        throw new Error(await pesanGagal(response, 'Gagal menambah pengguna'));
      }
      return response.json() as Promise<Pengguna>;
    },
    onSuccess: (baru) => {
      segarkan();
      setDialogTambah(false);
      setFormTambah({ username: '', email: '', nama_lengkap: '', role: 'operator', password: '' });
      toast({
        title: 'Pengguna ditambahkan',
        description: `${baru.nama_lengkap} (${baru.username}). Sampaikan passwordnya lewat jalur pribadi, dan minta ia menggantinya setelah login.`,
      });
    },
    onError: (error: Error) =>
      toast({ variant: 'destructive', title: 'Gagal menambah pengguna', description: error.message }),
  });

  const ubahPengguna = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<typeof formEdit> }) => {
      const response = await adminFetch(`/api/auth/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error(await pesanGagal(response, 'Gagal menyimpan perubahan'));
      }
      return response.json() as Promise<Pengguna>;
    },
    onSuccess: () => {
      segarkan();
      setSedangDiedit(null);
      toast({ title: 'Perubahan disimpan' });
    },
    onError: (error: Error) =>
      toast({ variant: 'destructive', title: 'Gagal menyimpan', description: error.message }),
  });

  const resetPassword = useMutation({
    mutationFn: async ({ id }: { id: number }) => {
      const response = await adminFetch(`/api/auth/users/${id}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password_baru: passwordReset }),
      });
      if (!response.ok) {
        throw new Error(await pesanGagal(response, 'Gagal menyetel ulang password'));
      }
    },
    onSuccess: () => {
      const nama = sedangDireset?.nama_lengkap ?? 'Pengguna';
      setSedangDireset(null);
      setPasswordReset('');
      toast({
        title: 'Password disetel ulang',
        description: `Sampaikan password baru ${nama} lewat jalur pribadi, bukan lewat grup.`,
      });
    },
    onError: (error: Error) =>
      toast({ variant: 'destructive', title: 'Gagal menyetel ulang password', description: error.message }),
  });

  const hapusPengguna = useMutation({
    mutationFn: async (target: Pengguna) => {
      const response = await adminFetch(`/api/auth/users/${target.id}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error(await pesanGagal(response, 'Gagal menghapus pengguna'));
      }
    },
    onSuccess: () => {
      segarkan();
      setAkanDihapus(null);
      toast({ title: 'Pengguna dihapus' });
    },
    onError: (error: Error) => {
      setAkanDihapus(null);
      toast({ variant: 'destructive', title: 'Gagal menghapus', description: error.message });
    },
  });

  const mulaiEdit = (target: Pengguna) => {
    setFormEdit({
      nama_lengkap: target.nama_lengkap,
      email: target.email,
      role: target.role,
      is_active: target.is_active,
    });
    setSedangDiedit(target);
  };

  const tambahSiap =
    /^[a-z0-9._-]{3,50}$/.test(formTambah.username.trim().toLowerCase()) &&
    formTambah.email.includes('@') &&
    formTambah.nama_lengkap.trim().length >= 3 &&
    formTambah.password.length >= PASSWORD_MIN;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{isAdmin ? 'Kelola Pengguna' : 'Akun Saya'}</h1>
        <p className="text-muted-foreground mt-1">
          {isAdmin
            ? 'Ganti password Anda, serta tambah dan atur akun admin dan operator.'
            : 'Ganti password akun Anda.'}
        </p>
      </div>

      <KartuPasswordSaya />

      {isAdmin && (
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Daftar Pengguna
                </CardTitle>
                <CardDescription>
                  {isLoading ? 'Memuat data...' : `${daftar?.length ?? 0} akun terdaftar`}
                </CardDescription>
              </div>
              <Button onClick={() => setDialogTambah(true)} data-testid="button-tambah-pengguna">
                <Plus className="h-4 w-4 mr-2" />
                Tambah Pengguna
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="py-8 text-center text-muted-foreground">Memuat daftar pengguna...</p>
            ) : isError ? (
              <p className="py-8 text-center text-destructive">Gagal memuat daftar pengguna.</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama</TableHead>
                      <TableHead>Username</TableHead>
                      {/* Kolom sekunder disembunyikan di layar sempit agar kolom Aksi tetap terlihat */}
                      <TableHead className="hidden xl:table-cell">Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden 2xl:table-cell">Dibuat</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {daftar?.map((p) => {
                      const diriSendiri = p.id === user?.id;
                      return (
                        <TableRow key={p.id} data-testid={`baris-pengguna-${p.id}`}>
                          <TableCell className="font-medium min-w-[9rem]">
                            {p.nama_lengkap}
                            {diriSendiri && (
                              <span className="ml-2 text-xs text-muted-foreground">(Anda)</span>
                            )}
                          </TableCell>
                          <TableCell className="text-muted-foreground">{p.username}</TableCell>
                          <TableCell className="hidden xl:table-cell text-muted-foreground">{p.email}</TableCell>
                          <TableCell>
                            <Badge variant={p.role === 'admin' ? 'default' : 'secondary'}>
                              {p.role === 'admin' ? 'Admin' : 'Operator'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {p.is_active ? (
                              <Badge variant="outline">Aktif</Badge>
                            ) : (
                              <Badge variant="destructive">Nonaktif</Badge>
                            )}
                          </TableCell>
                          <TableCell className="hidden 2xl:table-cell text-muted-foreground">
                            {formatTanggal(p.created_at)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => mulaiEdit(p)}
                                title="Ubah data"
                                aria-label={`Ubah data ${p.nama_lengkap}`}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                disabled={diriSendiri}
                                onClick={() => {
                                  setPasswordReset(buatPassword());
                                  setSedangDireset(p);
                                }}
                                title={
                                  diriSendiri
                                    ? 'Untuk akun sendiri gunakan Password Saya di atas'
                                    : 'Setel ulang password'
                                }
                                aria-label={`Setel ulang password ${p.nama_lengkap}`}
                              >
                                <KeyRound className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                disabled={diriSendiri}
                                onClick={() => setAkanDihapus(p)}
                                title={diriSendiri ? 'Tidak bisa menghapus akun sendiri' : 'Hapus pengguna'}
                                aria-label={`Hapus ${p.nama_lengkap}`}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
            <p className="mt-4 text-sm text-muted-foreground">
              Operator dapat mengelola berita, FAQ, galeri, informasi publik, dan permohonan.
              Pengaturan website serta kelola pengguna hanya untuk admin.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Tambah pengguna */}
      <Dialog open={dialogTambah} onOpenChange={setDialogTambah}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Tambah Pengguna</DialogTitle>
            <DialogDescription>
              Buat akun untuk petugas PPID. Password dibuat di sini, lalu sampaikan lewat jalur pribadi.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tambah-nama">Nama lengkap</Label>
              <Input
                id="tambah-nama"
                value={formTambah.nama_lengkap}
                onChange={(e) => setFormTambah((f) => ({ ...f, nama_lengkap: e.target.value }))}
                placeholder="Nama sesuai surat tugas"
                data-testid="input-tambah-nama"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="tambah-username">Username</Label>
                <Input
                  id="tambah-username"
                  value={formTambah.username}
                  onChange={(e) => setFormTambah((f) => ({ ...f, username: e.target.value }))}
                  placeholder="nama.petugas"
                  autoComplete="off"
                  data-testid="input-tambah-username"
                />
                <p className="text-xs text-muted-foreground">
                  Huruf kecil, angka, titik, garis bawah, atau tanda hubung. 3-50 karakter.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tambah-role">Role</Label>
                <Select
                  value={formTambah.role}
                  onValueChange={(v) => setFormTambah((f) => ({ ...f, role: v as 'admin' | 'operator' }))}
                >
                  <SelectTrigger id="tambah-role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="operator">Operator - kelola konten</SelectItem>
                    <SelectItem value="admin">Admin - akses penuh</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tambah-email">Email</Label>
              <Input
                id="tambah-email"
                type="email"
                value={formTambah.email}
                onChange={(e) => setFormTambah((f) => ({ ...f, email: e.target.value }))}
                placeholder="petugas@sorongkab.go.id"
                autoComplete="off"
                data-testid="input-tambah-email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tambah-password">Password awal</Label>
              <KolomPassword
                id="tambah-password"
                value={formTambah.password}
                withGenerator
                onChange={(v) => setFormTambah((f) => ({ ...f, password: v }))}
              />
              <p className="text-xs text-muted-foreground">Minimal {PASSWORD_MIN} karakter.</p>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDialogTambah(false)}>
              Batal
            </Button>
            <Button
              onClick={() => tambahPengguna.mutate()}
              disabled={!tambahSiap || tambahPengguna.isPending}
              data-testid="button-simpan-pengguna"
            >
              {tambahPengguna.isPending ? 'Menyimpan...' : 'Tambah Pengguna'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Ubah pengguna */}
      <Dialog open={sedangDiedit !== null} onOpenChange={(open) => !open && setSedangDiedit(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Ubah Pengguna</DialogTitle>
            <DialogDescription>{sedangDiedit?.username}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-nama">Nama lengkap</Label>
              <Input
                id="edit-nama"
                value={formEdit.nama_lengkap}
                onChange={(e) => setFormEdit((f) => ({ ...f, nama_lengkap: e.target.value }))}
                data-testid="input-edit-nama"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={formEdit.email}
                onChange={(e) => setFormEdit((f) => ({ ...f, email: e.target.value }))}
                data-testid="input-edit-email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-role">Role</Label>
              <Select
                value={formEdit.role}
                disabled={sedangDiedit?.id === user?.id}
                onValueChange={(v) => setFormEdit((f) => ({ ...f, role: v as 'admin' | 'operator' }))}
              >
                <SelectTrigger id="edit-role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="operator">Operator - kelola konten</SelectItem>
                  <SelectItem value="admin">Admin - akses penuh</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between rounded-md border p-3">
              <div>
                <Label htmlFor="edit-aktif">Akun aktif</Label>
                <p className="text-xs text-muted-foreground">
                  Akun nonaktif tidak bisa login, tetapi datanya tetap tersimpan.
                </p>
              </div>
              <Switch
                id="edit-aktif"
                checked={formEdit.is_active}
                disabled={sedangDiedit?.id === user?.id}
                onCheckedChange={(v) => setFormEdit((f) => ({ ...f, is_active: v }))}
              />
            </div>
            {sedangDiedit?.id === user?.id && (
              <p className="text-sm text-muted-foreground">
                Role dan status akun sendiri tidak bisa diubah, supaya Anda tidak terkunci dari panel ini.
              </p>
            )}
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setSedangDiedit(null)}>
              Batal
            </Button>
            <Button
              onClick={() => {
                if (!sedangDiedit) return;
                const diriSendiri = sedangDiedit.id === user?.id;
                ubahPengguna.mutate({
                  id: sedangDiedit.id,
                  data: diriSendiri
                    ? { nama_lengkap: formEdit.nama_lengkap, email: formEdit.email }
                    : formEdit,
                });
              }}
              disabled={
                ubahPengguna.isPending ||
                formEdit.nama_lengkap.trim().length < 3 ||
                !formEdit.email.includes('@')
              }
              data-testid="button-simpan-edit-pengguna"
            >
              {ubahPengguna.isPending ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Setel ulang password */}
      <Dialog
        open={sedangDireset !== null}
        onOpenChange={(open) => {
          if (!open) {
            setSedangDireset(null);
            setPasswordReset('');
          }
        }}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Setel Ulang Password</DialogTitle>
            <DialogDescription>
              Password baru untuk {sedangDireset?.nama_lengkap} ({sedangDireset?.username}).
              Pengguna tidak akan bisa memakai password lamanya lagi.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="reset-password">Password baru</Label>
            <KolomPassword
              id="reset-password"
              value={passwordReset}
              withGenerator
              onChange={setPasswordReset}
            />
            <p className="text-xs text-muted-foreground">
              Minimal {PASSWORD_MIN} karakter. Catat dulu, lalu sampaikan lewat jalur pribadi.
            </p>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setSedangDireset(null);
                setPasswordReset('');
              }}
            >
              Batal
            </Button>
            <Button
              onClick={() => sedangDireset && resetPassword.mutate({ id: sedangDireset.id })}
              disabled={passwordReset.length < PASSWORD_MIN || resetPassword.isPending}
              data-testid="button-simpan-reset-password"
            >
              {resetPassword.isPending ? 'Menyimpan...' : 'Setel Ulang'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Konfirmasi hapus */}
      <AlertDialog open={akanDihapus !== null} onOpenChange={(open) => !open && setAkanDihapus(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus pengguna ini?</AlertDialogTitle>
            <AlertDialogDescription>
              Akun {akanDihapus?.nama_lengkap} ({akanDihapus?.username}) akan dihapus permanen dan
              tidak bisa dipulihkan. Bila orangnya hanya berhenti bertugas, lebih baik nonaktifkan
              akunnya lewat tombol Ubah.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => akanDihapus && hapusPengguna.mutate(akanDihapus)}
              data-testid="button-konfirmasi-hapus-pengguna"
            >
              Hapus permanen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
