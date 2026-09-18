import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { useLocation } from 'wouter';

interface NewsItem {
  id: number;
  judul: string;
  slug: string;
  kategori: string;
  konten: string;
  gambar: string;
  tanggal_publikasi: string;
  penulis: string;
  views: number;
}

export function NewsSection() {
  const [, setLocation] = useLocation();
  const { data: beritaList } = useQuery<NewsItem[]>({
    queryKey: ['berita-list'],
    queryFn: async () => {
      const response = await fetch('/api/berita/list');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    },
    select: (data) => data.slice(0, 3),
  });

  const news = beritaList || [];

  const getExcerpt = (content: string, maxLength = 100) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <section className="py-16 bg-card/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2 font-serif">Berita & Pengumuman</h2>
            <p className="text-muted-foreground">Informasi terkini seputar PPID Kabupaten Sorong</p>
          </div>
          <Button variant="outline" onClick={() => setLocation('/berita')} data-testid="button-lihat-semua">
            Lihat Semua
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {news.map((item) => (
            <Card
              key={item.id}
              className="overflow-hidden hover-elevate active-elevate-2 cursor-pointer transition-all duration-200 group"
              onClick={() => window.location.href = `/berita/${item.id}`}
              data-testid={`news-${item.id}`}
            >
              {item.gambar && (
                <div className="aspect-video overflow-hidden">
                  <img
                    src={item.gambar}
                    alt={item.judul}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <div className="p-6">
                <Badge variant="secondary" className="mb-3">{item.kategori}</Badge>
                <h3 className="text-lg font-semibold mb-2 line-clamp-2">{item.judul}</h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{getExcerpt(item.konten)}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {(() => {
                    try {
                      return format(new Date(item.tanggal_publikasi), 'dd MMMM yyyy', { locale: id });
                    } catch {
                      return 'Tanggal tidak valid';
                    }
                  })()}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
