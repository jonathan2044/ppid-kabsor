import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function AdminPengaturanPage() {
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
            <CardContent>
              <p className="text-sm text-muted-foreground">Fitur edit hero section akan segera tersedia</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="kontak" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Kontak</CardTitle>
              <CardDescription>Kelola informasi kontak PPID</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Fitur edit kontak akan segera tersedia</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profil" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profil PPID</CardTitle>
              <CardDescription>Kelola profil, visi, misi, tugas, dan fungsi PPID</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Fitur edit profil akan segera tersedia</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
