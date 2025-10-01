import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, HelpCircle } from 'lucide-react';

interface FAQ {
  id: number;
  kategori: string;
  pertanyaan: string;
  jawaban: string;
}

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: faqList, isLoading } = useQuery<FAQ[]>({
    queryKey: ['/api/faq'],
    enabled: true,
  });

  const filteredData = faqList?.filter(item =>
    item.pertanyaan.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.jawaban.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.kategori.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const groupedFAQ = filteredData.reduce((acc, faq) => {
    if (!acc[faq.kategori]) {
      acc[faq.kategori] = [];
    }
    acc[faq.kategori].push(faq);
    return acc;
  }, {} as Record<string, FAQ[]>);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
              <HelpCircle className="h-8 w-8 text-primary" />
              Pertanyaan yang Sering Diajukan (FAQ)
            </h1>
            <p className="text-muted-foreground">
              Temukan jawaban atas pertanyaan umum seputar layanan PPID Kabupaten Sorong
            </p>
          </div>

          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari pertanyaan..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  data-testid="input-search-faq"
                />
              </div>
            </CardContent>
          </Card>

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Memuat FAQ...</p>
            </div>
          ) : Object.keys(groupedFAQ).length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">Tidak ada FAQ yang ditemukan</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedFAQ).map(([kategori, faqs]) => (
                <Card key={kategori}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {kategori}
                      <Badge variant="secondary">{faqs.length}</Badge>
                    </CardTitle>
                    <CardDescription>
                      Pertanyaan seputar {kategori.toLowerCase()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      {faqs.map((faq) => (
                        <AccordionItem key={faq.id} value={`faq-${faq.id}`} data-testid={`accordion-faq-${faq.id}`}>
                          <AccordionTrigger className="text-left">
                            {faq.pertanyaan}
                          </AccordionTrigger>
                          <AccordionContent>
                            <p className="text-muted-foreground whitespace-pre-wrap">
                              {faq.jawaban}
                            </p>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
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
