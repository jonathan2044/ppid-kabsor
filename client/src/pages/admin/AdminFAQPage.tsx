import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function AdminFAQPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Kelola FAQ</h1>
          <p className="text-muted-foreground mt-1">Tambah, edit, dan hapus FAQ</p>
        </div>
        <Button data-testid="button-add-faq">
          <Plus className="h-4 w-4 mr-2" />
          Tambah FAQ
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar FAQ</CardTitle>
          <CardDescription>Manage frequently asked questions</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Fitur CRUD FAQ akan segera tersedia</p>
        </CardContent>
      </Card>
    </div>
  );
}
