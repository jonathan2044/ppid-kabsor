import { Button } from '@/components/ui/button';
import { PapuaPattern } from './PapuaPattern';
import { FileText, Search } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';

interface HeroContent {
  title: string;
  subtitle: string;
  bg_image: string;
}

export function Hero() {
  const [, setLocation] = useLocation();
  const { data: heroContent } = useQuery<HeroContent>({
    queryKey: ['/api/pengaturan/hero'],
  });

  return (
    <section className="relative w-full h-[600px] overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-900/95 to-primary-800/70 z-10" />
      <div 
        className="absolute inset-0 bg-cover bg-center" 
        style={{ backgroundImage: `url(${heroContent?.bg_image || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070'})` }}
      />
      
      {/* Papua Pattern Overlay */}
      <PapuaPattern className="absolute inset-0 z-20 text-gold" opacity={0.08} />

      {/* Content */}
      <div className="relative z-30 container mx-auto px-4 h-full flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 font-serif">
          {heroContent?.title || 'Portal PPID Kabupaten Sorong'}
        </h1>
        <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl">
          {heroContent?.subtitle || 'Transparansi dan Keterbukaan Informasi Publik untuk Masyarakat Kabupaten Sorong'}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            size="lg"
            className="bg-gold hover:bg-gold-light text-white border-0 min-h-12 px-8"
            onClick={() => setLocation('/permohonan')}
            data-testid="button-ajukan-permohonan"
          >
            <FileText className="mr-2 h-5 w-5" />
            Ajukan Permohonan Informasi
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="bg-background/10 backdrop-blur-sm border-white/30 text-white hover:bg-background/20 min-h-12 px-8"
            onClick={() => setLocation('/tracking')}
            data-testid="button-cek-status"
          >
            <Search className="mr-2 h-5 w-5" />
            Cek Status Permohonan
          </Button>
        </div>
      </div>
    </section>
  );
}
