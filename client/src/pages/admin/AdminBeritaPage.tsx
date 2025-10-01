import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function AdminBeritaPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Kelola Berita</h1>
          <p className="text-muted-foreground mt-1">Tambah, edit, dan hapus berita</p>
        </div>
        <Button data-testid="button-add-berita">
          <Plus className="h-4 w-4 mr-2" />
          Tambah Berita
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Berita</CardTitle>
          <CardDescription>Manage all news articles</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Fitur CRUD berita akan segera tersedia</p>
        </CardContent>
      </Card>
    </div>
  );
}
