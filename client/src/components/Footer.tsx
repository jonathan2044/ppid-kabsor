import { PapuaPattern, PapuaBorder } from './PapuaPattern';
import { Mail, Phone, MapPin, Facebook, Instagram, Youtube } from 'lucide-react';

export function Footer() {
  const links = {
    'Tentang PPID': ['Profil Singkat', 'Visi & Misi', 'Struktur Organisasi', 'Tugas & Fungsi'],
    'Layanan': ['Permohonan Informasi', 'Tracking Permohonan', 'Pengajuan Keberatan', 'FAQ'],
    'Informasi': ['Informasi Berkala', 'Informasi Serta-Merta', 'Informasi Setiap Saat', 'Regulasi'],
    'Legal': ['Dasar Hukum', 'SOP', 'Maklumat Pelayanan', 'Privasi']
  };

  return (
    <footer className="relative bg-card border-t border-papua-terracotta/20">
      <PapuaPattern className="absolute inset-0 text-papua-terracotta" opacity={0.03} />
      
      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <img 
              src="/assets/logo-sorong.png" 
              alt="Logo Kabupaten Sorong" 
              className="h-16 w-auto mb-4"
            />
            <h3 className="font-semibold mb-2">PPID Kabupaten Sorong</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Portal Informasi Publik Kabupaten Sorong untuk transparansi dan keterbukaan informasi
            </p>
            <div className="flex gap-2">
              <a
                href="#"
                className="p-2 rounded-md bg-primary/10 text-primary hover-elevate active-elevate-2 transition-all"
                onClick={(e) => {
                  e.preventDefault();
                  console.log('Facebook clicked');
                }}
                data-testid="link-facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="p-2 rounded-md bg-primary/10 text-primary hover-elevate active-elevate-2 transition-all"
                onClick={(e) => {
                  e.preventDefault();
                  console.log('Instagram clicked');
                }}
                data-testid="link-instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="p-2 rounded-md bg-primary/10 text-primary hover-elevate active-elevate-2 transition-all"
                onClick={(e) => {
                  e.preventDefault();
                  console.log('Youtube clicked');
                }}
                data-testid="link-youtube"
              >
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <h4 className="font-semibold mb-4">{title}</h4>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      onClick={(e) => {
                        e.preventDefault();
                        console.log(`Navigate to: ${item}`);
                      }}
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <PapuaBorder className="my-8" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <h4 className="font-semibold mb-4">Kontak Kami</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">
                  Jl. Pattimura No. 1, Aimas, Kabupaten Sorong, Papua Barat Daya
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="text-muted-foreground">(0951) 123456</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="text-muted-foreground">ppid@sorongkab.go.id</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Jam Layanan</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex justify-between">
                <span>Senin - Kamis</span>
                <span className="font-medium">08:00 - 16:00 WIT</span>
              </div>
              <div className="flex justify-between">
                <span>Jumat</span>
                <span className="font-medium">08:00 - 16:30 WIT</span>
              </div>
              <div className="flex justify-between">
                <span>Sabtu - Minggu</span>
                <span className="font-medium text-muted-foreground/60">Libur</span>
              </div>
            </div>
          </div>
        </div>

        <PapuaBorder className="my-8" />

        <div className="text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} PPID Kabupaten Sorong. Seluruh hak cipta dilindungi.</p>
          <p className="mt-1">Dibuat dengan ❤️ untuk masyarakat Kabupaten Sorong</p>
        </div>
      </div>
    </footer>
  );
}
