import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

export default function AdminPermohonanPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Kelola Permohonan</h1>
        <p className="text-muted-foreground mt-1">Review dan proses permohonan informasi dari masyarakat</p>
      </div>

      <Tabs defaultValue="menunggu" className="space-y-4">
        <TabsList>
          <TabsTrigger value="menunggu">
            Menunggu
            <Badge variant="secondary" className="ml-2">0</Badge>
          </TabsTrigger>
          <TabsTrigger value="diproses">
            Diproses
            <Badge variant="secondary" className="ml-2">0</Badge>
          </TabsTrigger>
          <TabsTrigger value="selesai">Selesai</TabsTrigger>
          <TabsTrigger value="ditolak">Ditolak</TabsTrigger>
        </TabsList>

        <TabsContent value="menunggu">
          <Card>
            <CardHeader>
              <CardTitle>Permohonan Menunggu</CardTitle>
              <CardDescription>Permohonan yang menunggu untuk diproses</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Fitur review permohonan akan segera tersedia</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="diproses">
          <Card>
            <CardHeader>
              <CardTitle>Permohonan Sedang Diproses</CardTitle>
              <CardDescription>Permohonan yang sedang dalam proses</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Fitur review permohonan akan segera tersedia</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="selesai">
          <Card>
            <CardHeader>
              <CardTitle>Permohonan Selesai</CardTitle>
              <CardDescription>Permohonan yang telah selesai diproses</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Fitur review permohonan akan segera tersedia</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ditolak">
          <Card>
            <CardHeader>
              <CardTitle>Permohonan Ditolak</CardTitle>
              <CardDescription>Permohonan yang ditolak</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Fitur review permohonan akan segera tersedia</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
