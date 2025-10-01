import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

//todo: remove mock functionality
const news = [
  {
    title: 'Sosialisasi UU Keterbukaan Informasi Publik di Kabupaten Sorong',
    excerpt: 'PPID Kabupaten Sorong mengadakan sosialisasi mengenai pentingnya keterbukaan informasi publik kepada masyarakat',
    date: '15 Desember 2024',
    category: 'Kegiatan',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=400'
  },
  {
    title: 'Pencapaian Target Layanan Informasi Publik 2024',
    excerpt: 'PPID mencapai tingkat penyelesaian permohonan informasi sebesar 95% dengan rata-rata waktu layanan 3.5 hari',
    date: '10 Desember 2024',
    category: 'Pengumuman',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=400'
  },
  {
    title: 'Peluncuran Portal PPID Kabupaten Sorong Terbaru',
    excerpt: 'Portal baru hadir dengan fitur yang lebih lengkap dan mudah diakses untuk masyarakat Kabupaten Sorong',
    date: '1 Desember 2024',
    category: 'Berita',
    image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=400'
  }
];

export function NewsSection() {
  return (
    <section className="py-16 bg-card/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2 font-serif">Berita & Pengumuman</h2>
            <p className="text-muted-foreground">Informasi terkini seputar PPID Kabupaten Sorong</p>
          </div>
          <Button variant="outline" onClick={() => console.log('View all news')} data-testid="button-lihat-semua">
            Lihat Semua
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {news.map((item, index) => (
            <Card
              key={index}
              className="overflow-hidden hover-elevate active-elevate-2 cursor-pointer transition-all duration-200 group"
              onClick={() => console.log(`View news: ${item.title}`)}
              data-testid={`news-${index}`}
            >
              <div className="aspect-video overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <Badge variant="secondary" className="mb-3">{item.category}</Badge>
                <h3 className="text-lg font-semibold mb-2 line-clamp-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{item.excerpt}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {item.date}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
