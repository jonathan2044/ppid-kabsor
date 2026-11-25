import { useQuery } from '@tanstack/react-query';
import { Link, useRoute } from 'wouter';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Calendar, Eye, User } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { sanitizeHtml } from '@/lib/utils';

interface Berita {
  id: number;
  judul: string;
  slug: string;
  kategori?: string;
  konten: string;
  gambar?: string;
  penulis?: string;
  tanggal_publikasi: string;
  views: number;
}

function formatTanggal(tanggal: string) {
  try {
    return format(new Date(tanggal), 'dd MMMM yyyy', { locale: id });
  } catch {
    return '-';
  }
}

export default function BeritaDetailPage() {
  const [, params] = useRoute('/berita/:slug');
  const slug = params?.slug ?? '';

  const { data: berita, isLoading, isError } = useQuery<Berita>({
    queryKey: ['berita-detail', slug],
    enabled: slug !== '',
    queryFn: async () => {
      const response = await fetch(`/api/berita/${encodeURIComponent(slug)}`);
      if (!response.ok) {
        throw new Error(`Berita tidak ditemukan (${response.status})`);
      }
      return response.json();
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-10">
        <Button variant="ghost" asChild className="mb-6 -ml-2">
          <Link href="/berita" data-testid="link-kembali-berita">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Berita
          </Link>
        </Button>

        {isLoading ? (
          <p className="text-muted-foreground">Memuat berita...</p>
        ) : isError || !berita ? (
          <Card className="max-w-2xl">
            <CardContent className="py-10 text-center space-y-3">
              <h1 className="text-xl font-bold">Berita tidak ditemukan</h1>
              <p className="text-sm text-muted-foreground">
                Berita yang Anda cari mungkin sudah dihapus atau tautannya salah.
              </p>
              <Button asChild variant="outline">
                <Link href="/berita">Lihat daftar berita</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <article className="max-w-3xl">
            {berita.kategori && (
              <Badge variant="secondary" className="mb-3" data-testid="badge-kategori-detail">
                {berita.kategori}
              </Badge>
            )}

            <h1 className="text-3xl md:text-4xl font-bold leading-tight" data-testid="text-judul-berita">
              {berita.judul}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {formatTanggal(berita.tanggal_publikasi)}
              </span>
              {berita.penulis && (
                <span className="flex items-center gap-1.5">
                  <User className="h-4 w-4" />
                  {berita.penulis}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Eye className="h-4 w-4" />
                {berita.views} kali dibaca
              </span>
            </div>

            {berita.gambar && (
              <img
                src={berita.gambar}
                alt={berita.judul}
                className="mt-6 w-full rounded-lg border bg-muted object-cover"
                data-testid="img-berita-detail"
              />
            )}

            {/* Konten ditulis admin lewat editor, lalu disaring sebelum ditampilkan */}
            <div
              className="prose prose-slate mt-8 max-w-none prose-headings:font-semibold prose-a:text-primary"
              data-testid="konten-berita"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(berita.konten) }}
            />
          </article>
        )}
      </main>
      <Footer />
    </div>
  );
}
