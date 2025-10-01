import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Download, FileText, Calendar, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface InformasiPublik {
  id: number;
  judul: string;
  kategori: string;
  deskripsi: string;
  file_url?: string;
  tanggal_publish: string;
  views: number;
}

export default function InformasiPublikPage() {
  const [activeTab, setActiveTab] = useState('berkala');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: informasiList, isLoading } = useQuery<InformasiPublik[]>({
    queryKey: ['/api/informasi-publik', activeTab],
    enabled: true,
  });

  const filteredData = informasiList?.filter(item =>
    item.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.deskripsi.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const renderInformasiCard = (item: InformasiPublik) => (
    <Card key={item.id} className="hover-elevate" data-testid={`card-informasi-${item.id}`}>
      <CardHeader>
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{item.judul}</CardTitle>
            <CardDescription>{item.deskripsi}</CardDescription>
          </div>
          <Badge variant="secondary" data-testid={`badge-kategori-${item.id}`}>
            {item.kategori}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{format(new Date(item.tanggal_publish), 'dd MMM yyyy', { locale: id })}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span>{item.views} views</span>
            </div>
          </div>
          <div className="flex gap-2">
            {item.file_url && (
              <Button variant="outline" size="sm" asChild data-testid={`button-download-${item.id}`}>
                <a href={item.file_url} target="_blank" rel="noopener noreferrer">
                  <Download className="mr-2 h-4 w-4" />
                  Unduh
                </a>
              </Button>
            )}
            <Button variant="default" size="sm" data-testid={`button-detail-${item.id}`}>
              <FileText className="mr-2 h-4 w-4" />
              Detail
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Informasi Publik</h1>
            <p className="text-muted-foreground">
              Akses informasi publik Pemerintah Kabupaten Sorong sesuai UU KIP
            </p>
          </div>

          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari informasi publik..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  data-testid="input-search"
                />
              </div>
            </CardContent>
          </Card>

          <Tabs value={activeTab} onValueChange={setActiveTab} data-testid="tabs-kategori">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="berkala" data-testid="tab-berkala">
                Informasi Berkala
              </TabsTrigger>
              <TabsTrigger value="serta-merta" data-testid="tab-serta-merta">
                Serta Merta
              </TabsTrigger>
              <TabsTrigger value="setiap-saat" data-testid="tab-setiap-saat">
                Setiap Saat
              </TabsTrigger>
              <TabsTrigger value="dikecualikan" data-testid="tab-dikecualikan">
                Dikecualikan
              </TabsTrigger>
            </TabsList>

            <TabsContent value="berkala" className="space-y-4">
              <Card className="bg-muted/50">
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground">
                    <strong>Informasi Berkala</strong> adalah informasi yang wajib disediakan dan diumumkan secara berkala 
                    seperti profil badan publik, ringkasan informasi tentang program dan/atau kegiatan, ringkasan laporan 
                    keuangan, dan ringkasan laporan akses informasi publik.
                  </p>
                </CardContent>
              </Card>
              {isLoading ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Memuat data...</p>
                </div>
              ) : filteredData.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <p className="text-muted-foreground">Belum ada informasi berkala tersedia</p>
                  </CardContent>
                </Card>
              ) : (
                filteredData.map(renderInformasiCard)
              )}
            </TabsContent>

            <TabsContent value="serta-merta" className="space-y-4">
              <Card className="bg-muted/50">
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground">
                    <strong>Informasi Serta Merta</strong> adalah informasi yang wajib diumumkan secara serta-merta tanpa penundaan 
                    karena dapat mengancam hajat hidup orang banyak dan ketertiban umum, seperti informasi tentang bencana alam, 
                    kerusakan lingkungan, atau wabah penyakit.
                  </p>
                </CardContent>
              </Card>
              {isLoading ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Memuat data...</p>
                </div>
              ) : filteredData.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <p className="text-muted-foreground">Belum ada informasi serta merta tersedia</p>
                  </CardContent>
                </Card>
              ) : (
                filteredData.map(renderInformasiCard)
              )}
            </TabsContent>

            <TabsContent value="setiap-saat" className="space-y-4">
              <Card className="bg-muted/50">
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground">
                    <strong>Informasi Setiap Saat</strong> adalah informasi yang wajib tersedia setiap saat dan dapat diakses 
                    oleh publik seperti daftar informasi publik, hasil keputusan badan publik, seluruh kebijakan dan peraturan, 
                    serta prosedur kerja pegawai.
                  </p>
                </CardContent>
              </Card>
              {isLoading ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Memuat data...</p>
                </div>
              ) : filteredData.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <p className="text-muted-foreground">Belum ada informasi setiap saat tersedia</p>
                  </CardContent>
                </Card>
              ) : (
                filteredData.map(renderInformasiCard)
              )}
            </TabsContent>

            <TabsContent value="dikecualikan" className="space-y-4">
              <Card className="bg-muted/50 border-destructive/20">
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground">
                    <strong>Informasi Dikecualikan</strong> adalah informasi yang tidak dapat diberikan kepada pemohon karena 
                    dikecualikan berdasarkan Undang-Undang, seperti informasi yang dapat mengancam pertahanan dan keamanan negara, 
                    atau informasi pribadi yang dapat merugikan pihak lain.
                  </p>
                </CardContent>
              </Card>
              {isLoading ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Memuat data...</p>
                </div>
              ) : filteredData.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <p className="text-muted-foreground">Belum ada daftar informasi dikecualikan tersedia</p>
                  </CardContent>
                </Card>
              ) : (
                filteredData.map(renderInformasiCard)
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}
