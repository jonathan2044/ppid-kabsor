import { Card } from '@/components/ui/card';
import { TrendingUp, CheckCircle, Clock, Users } from 'lucide-react';

//todo: remove mock functionality
const stats = [
  {
    icon: TrendingUp,
    label: 'Permohonan Bulan Ini',
    value: '124',
    change: '+12% dari bulan lalu',
    color: 'text-primary'
  },
  {
    icon: CheckCircle,
    label: 'Permohonan Selesai',
    value: '98',
    change: '79% tingkat penyelesaian',
    color: 'text-chart-1'
  },
  {
    icon: Clock,
    label: 'Rata-rata Waktu Layanan',
    value: '3.5 hari',
    change: 'Target: 10 hari kerja',
    color: 'text-gold'
  },
  {
    icon: Users,
    label: 'Kepuasan Masyarakat',
    value: '4.7/5.0',
    change: 'Dari 156 responden',
    color: 'text-chart-3'
  }
];

export function StatsDashboard() {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3 font-serif">Statistik Layanan</h2>
          <p className="text-muted-foreground">Transparansi kinerja layanan PPID Kabupaten Sorong</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="p-6" data-testid={`stat-${stat.label.toLowerCase().replace(/\s+/g, '-')}`}>
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-2 rounded-lg bg-${stat.color.split('-')[1]}/10`}>
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </div>
                <div className="text-3xl font-bold mb-1 text-gold">{stat.value}</div>
                <div className="text-sm font-medium text-foreground mb-1">{stat.label}</div>
                <div className="text-xs text-muted-foreground">{stat.change}</div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
