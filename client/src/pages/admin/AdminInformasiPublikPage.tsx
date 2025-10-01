import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function AdminInformasiPublikPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Kelola Informasi Publik</h1>
          <p className="text-muted-foreground mt-1">Upload dan manage dokumen informasi publik</p>
        </div>
        <Button data-testid="button-add-dokumen">
          <Plus className="h-4 w-4 mr-2" />
          Upload Dokumen
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dokumen Informasi Publik</CardTitle>
          <CardDescription>Manage public information documents</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Fitur CRUD dokumen akan segera tersedia</p>
        </CardContent>
      </Card>
    </div>
  );
}
