import { Card } from '@/components/ui/card';
import { FileText, Search, FolderOpen } from 'lucide-react';
import { PapuaBorder } from './PapuaPattern';

const cards = [
  {
    icon: FileText,
    title: 'Permohonan Informasi',
    description: 'Ajukan permohonan informasi publik secara online',
    color: 'text-primary'
  },
  {
    icon: Search,
    title: 'Cek Status Permohonan',
    description: 'Lacak status permohonan informasi Anda',
    color: 'text-gold'
  },
  {
    icon: FolderOpen,
    title: 'Daftar Informasi Publik',
    description: 'Jelajahi katalog lengkap informasi publik',
    color: 'text-chart-3'
  }
];

export function QuickAccessCards() {
  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card, index) => {
            const Icon = card.icon;
            return (
              <Card
                key={index}
                className="p-6 hover-elevate active-elevate-2 cursor-pointer transition-all duration-200 overflow-visible"
                onClick={() => console.log(`Navigate to: ${card.title}`)}
                data-testid={`card-${card.title.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <PapuaBorder className="mb-4" />
                <Icon className={`h-12 w-12 ${card.color} mb-4`} />
                <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
                <p className="text-muted-foreground text-sm">{card.description}</p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
