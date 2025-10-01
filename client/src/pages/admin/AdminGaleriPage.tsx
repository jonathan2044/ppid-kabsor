import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function AdminGaleriPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Kelola Galeri</h1>
          <p className="text-muted-foreground mt-1">Upload dan manage foto galeri</p>
        </div>
        <Button data-testid="button-add-galeri">
          <Plus className="h-4 w-4 mr-2" />
          Upload Foto
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Galeri Foto</CardTitle>
          <CardDescription>Manage photo gallery</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Fitur CRUD galeri akan segera tersedia</p>
        </CardContent>
      </Card>
    </div>
  );
}
