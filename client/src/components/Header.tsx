import { Search, Menu, X, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const navItems = [
    {
      label: 'Profil',
      items: ['Visi & Misi', 'Struktur Organisasi', 'Tugas & Fungsi', 'SK & Pedoman', 'Instrument KIP', 'Maklumat Pelayanan', 'SOP PPID']
    },
    {
      label: 'Informasi Publik',
      items: ['Daftar Informasi Publik', 'Informasi Berkala', 'Informasi Serta-Merta', 'Informasi Setiap Saat', 'Informasi Dikecualikan']
    },
    {
      label: 'Layanan',
      items: ['Permohonan Informasi', 'Tracking Permohonan', 'Pengajuan Keberatan', 'Tata Cara & Alur', 'Layanan Disabilitas', 'FAQ']
    },
    { label: 'Berita', items: [] },
    { label: 'Kontak', items: [] }
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto">
        <div className="flex h-20 items-center justify-between px-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img 
              src="/attached_assets/Logo-Kabupaten-Sorong_1759285014587.png" 
              alt="Logo Kabupaten Sorong" 
              className="h-14 w-auto"
            />
            <div className="hidden lg:block">
              <div className="text-sm font-semibold text-foreground">PPID Kabupaten Sorong</div>
              <div className="text-xs text-muted-foreground">Portal Informasi Publik</div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            <a href="/" className="text-sm font-medium text-foreground hover-elevate px-3 py-2 rounded-md transition-colors">
              Beranda
            </a>
            {navItems.map((item) => (
              <div key={item.label} className="relative group">
                <button className="flex items-center gap-1 text-sm font-medium text-foreground hover-elevate px-3 py-2 rounded-md transition-colors">
                  {item.label}
                  {item.items.length > 0 && <ChevronDown className="h-3 w-3" />}
                </button>
                {item.items.length > 0 && (
                  <div className="absolute left-0 mt-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="bg-popover border border-popover-border rounded-md shadow-lg py-2">
                      {item.items.map((subItem) => (
                        <a
                          key={subItem}
                          href="#"
                          className="block px-4 py-2 text-sm text-popover-foreground hover-elevate transition-colors"
                          onClick={(e) => {
                            e.preventDefault();
                            console.log(`Navigate to: ${subItem}`);
                          }}
                        >
                          {subItem}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {searchOpen ? (
              <div className="flex items-center gap-2">
                <Input
                  type="search"
                  placeholder="Cari informasi..."
                  className="w-64 h-9"
                  autoFocus
                  data-testid="input-search"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSearchOpen(false)}
                  data-testid="button-close-search"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchOpen(true)}
                data-testid="button-open-search"
              >
                <Search className="h-4 w-4" />
              </Button>
            )}

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-border/40 py-4 px-4 space-y-4">
            <a href="/" className="block py-2 text-sm font-medium text-foreground" onClick={() => setMobileMenuOpen(false)}>
              Beranda
            </a>
            {navItems.map((item) => (
              <div key={item.label} className="space-y-2">
                <div className="text-sm font-semibold text-foreground">{item.label}</div>
                {item.items.map((subItem) => (
                  <a
                    key={subItem}
                    href="#"
                    className="block py-2 pl-4 text-sm text-muted-foreground hover:text-foreground"
                    onClick={(e) => {
                      e.preventDefault();
                      console.log(`Navigate to: ${subItem}`);
                      setMobileMenuOpen(false);
                    }}
                  >
                    {subItem}
                  </a>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
