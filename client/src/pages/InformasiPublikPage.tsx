import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search, Download, FileText, Calendar, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface InformasiPublik {
  id: number;
  judul: string;
  kategori: string;
  deskripsi: string;
  file_dokumen?: string;
  tanggal_upload: string;
  jumlah_unduhan: number;
}

export default function InformasiPublikPage() {
  const [activeTab, setActiveTab] = useState('berkala');
  const [searchQuery, setSearchQuery] = useState('');

  // Log component mount
  useEffect(() => {
    console.log('🏠 InformasiPublikPage mounted');
    console.log('📅 Mount timestamp:', new Date().toISOString());
  }, []);

  // Log tab changes
  useEffect(() => {
    console.group('📑 TAB CHANGE');
    console.log('🔄 Active tab changed to:', activeTab);
    console.log('📅 Timestamp:', new Date().toISOString());
    console.groupEnd();
  }, [activeTab]);

  const { data: informasiList, isLoading } = useQuery<InformasiPublik[]>({
    queryKey: ['informasi-publik', activeTab],
    queryFn: async () => {
      // Convert frontend tab names to backend enum values
      const categoryMap: Record<string, string> = {
        'berkala': 'berkala',
        'serta-merta': 'serta_merta', 
        'setiap-saat': 'setiap_saat',
        'dikecualikan': 'dikecualikan'
      };
      const backendKategori = categoryMap[activeTab] || activeTab;
      
      console.group('🌐 API FETCH');
      console.log('📤 Request details:', {
        activeTab,
        backendKategori,
        url: `/api/informasi-publik/list?kategori=${backendKategori}`
      });
      
      const response = await fetch(`/api/informasi-publik/list?kategori=${backendKategori}`);
      console.log('📊 Response status:', response.status);
      
      if (!response.ok) {
        console.error('❌ API Error:', response.statusText);
        console.groupEnd();
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('✅ Data received:', {
        count: data.length,
        items: data.map((item: any) => ({ id: item.id, judul: item.judul }))
      });
      console.groupEnd();
      
      return data;
    },
    enabled: true,
  });

  const filteredData = informasiList?.filter(item =>
    item.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.deskripsi.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  // Log search results
  useEffect(() => {
    if (searchQuery) {
      console.group('🔍 SEARCH RESULTS');
      console.log('🔎 Search query:', searchQuery);
      console.log('📊 Results:', {
        total: informasiList?.length || 0,
        filtered: filteredData.length,
        percentage: informasiList?.length ? ((filteredData.length / informasiList.length) * 100).toFixed(1) + '%' : '0%'
      });
      console.log('📋 Filtered items:', filteredData.map(item => ({ id: item.id, judul: item.judul })));
      console.groupEnd();
    }
  }, [searchQuery, informasiList, filteredData]);

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

  const handleDownload = async (item: InformasiPublik) => {
    console.group('🔽 DOWNLOAD BUTTON CLICKED');
    console.log('📄 Item Details:', {
      id: item.id,
      judul: item.judul,
      kategori: item.kategori,
      file_dokumen: item.file_dokumen,
      jumlah_unduhan: item.jumlah_unduhan
    });
    console.log('📅 Timestamp:', new Date().toISOString());
    
    try {
      console.log('🔄 Tracking download via API...');
      const trackResponse = await fetch(`/api/informasi-publik/${item.id}`, {
        method: 'GET'
      });
      
      console.log('📊 Track Response Status:', trackResponse.status);
      if (!trackResponse.ok) {
        console.warn('⚠️ Download tracking failed:', trackResponse.statusText);
      } else {
        console.log('✅ Download tracked successfully');
      }
      
      // Trigger file download
      if (item.file_dokumen) {
        console.log('📥 Opening file:', item.file_dokumen);
        window.open(item.file_dokumen, '_blank');
        console.log('✅ File download initiated');
      } else {
        console.error('❌ No file available for download');
        alert('File tidak tersedia untuk diunduh');
      }
    } catch (error) {
      console.error('❌ Download failed:', error);
      console.error('🔍 Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : 'No stack trace'
      });
      alert('Gagal mengunduh file. Silakan coba lagi.');
    }
    console.groupEnd();
  };

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
              <span>{formatSafeDate(item.tanggal_upload)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span>{item.jumlah_unduhan} unduhan</span>
            </div>
          </div>
          <div className="flex gap-2">
            {item.file_dokumen && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleDownload(item)}
                data-testid={`button-download-${item.id}`}
              >
                <Download className="mr-2 h-4 w-4" />
                Unduh
              </Button>
            )}
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="default" 
                  size="sm" 
                  data-testid={`button-detail-${item.id}`}
                  onClick={() => {
                    console.group('🔍 DETAIL BUTTON CLICKED');
                    console.log('📄 Item Details:', {
                      id: item.id,
                      judul: item.judul,
                      kategori: item.kategori,
                      deskripsi: item.deskripsi,
                      tanggal_upload: item.tanggal_upload,
                      jumlah_unduhan: item.jumlah_unduhan
                    });
                    console.log('📅 Timestamp:', new Date().toISOString());
                    console.log('🎯 Action: Opening detail modal');
                    console.groupEnd();
                  }}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Detail
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{item.judul}</DialogTitle>
                  <DialogDescription>
                    Informasi detail tentang dokumen ini
                  </DialogDescription>
                  <Badge variant="secondary" className="w-fit mt-2">
                    {item.kategori}
                  </Badge>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Deskripsi</h4>
                    <p className="text-sm text-muted-foreground">{item.deskripsi}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <h4 className="font-medium mb-1">Tanggal Upload</h4>
                      <p className="text-muted-foreground">{formatSafeDate(item.tanggal_upload)}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Jumlah Unduhan</h4>
                      <p className="text-muted-foreground">{item.jumlah_unduhan} kali</p>
                    </div>
                  </div>
                  {item.file_dokumen && (
                    <div className="pt-4 border-t">
                      <Button 
                        onClick={() => handleDownload(item)}
                        className="w-full"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Unduh Dokumen
                      </Button>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
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
