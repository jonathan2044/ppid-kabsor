import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Calendar, Eye, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface Berita {
  id: number;
  judul: string;
  kategori: string;
  konten: string;
  gambar?: string;
  tanggal_publikasi: string;
  views: number;
  penulis: string;
}

export default function BeritaPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: beritaList, isLoading } = useQuery<Berita[]>({
    queryKey: ['berita'],
    queryFn: async () => {
      const response = await fetch('/api/berita/list');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    },
    enabled: true,
  });

  const filteredData = beritaList?.filter(item =>
    item.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.konten.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const formatSafeDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Tanggal tidak valid';
      }
      return format(date, 'dd MMM yyyy', { locale: id });
    } catch {
      return 'Tanggal tidak valid';
    }
  };

  const getExcerpt = (content: string, maxLength = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Berita PPID</h1>
            <p className="text-muted-foreground">
              Informasi terkini seputar layanan informasi publik Kabupaten Sorong
            </p>
          </div>

          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari berita..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  data-testid="input-search-berita"
                />
              </div>
            </CardContent>
          </Card>

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Memuat berita...</p>
            </div>
          ) : filteredData.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">Belum ada berita tersedia</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredData.map((berita) => (
                <Card key={berita.id} className="hover-elevate overflow-hidden" data-testid={`card-berita-${berita.id}`}>
                  {berita.gambar && (
                    <div className="aspect-video w-full overflow-hidden bg-muted">
                      <img
                        src={berita.gambar}
                        alt={berita.judul}
                        className="w-full h-full object-cover"
                        data-testid={`img-berita-${berita.id}`}
                      />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" data-testid={`badge-kategori-${berita.id}`}>
                        {berita.kategori}
                      </Badge>
                    </div>
                    <CardTitle className="line-clamp-2">{berita.judul}</CardTitle>
                    <CardDescription className="line-clamp-3">
                      {getExcerpt(berita.konten)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formatSafeDate(berita.tanggal_publikasi)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        <span>{berita.views}</span>
                      </div>
                    </div>
                    <a
                      href={`/berita/${berita.id}`}
                      className="text-primary hover:underline flex items-center gap-1 text-sm font-medium"
                      data-testid={`link-detail-${berita.id}`}
                    >
                      Baca Selengkapnya
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
