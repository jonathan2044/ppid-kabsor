import { Card } from '@/components/ui/card';
import { TrendingUp, CheckCircle, Clock, FileText } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface Stat {
  label: string;
  value: string;
  change: string;
  icon: string;
  color: string;
}

const iconMap: Record<string, any> = {
  TrendingUp,
  CheckCircle,
  Clock,
  FileText,
};

const colorBgMap: Record<string, string> = {
  'text-primary': 'bg-primary/10',
  'text-chart-1': 'bg-chart-1/10',
  'text-gold': 'bg-gold/10',
  'text-chart-3': 'bg-chart-3/10',
};

export function StatsDashboard() {
  const { data: statsData, isLoading } = useQuery<{ stats: Stat[] }>({
    queryKey: ['/api/stats/dashboard'],
  });

  const stats = statsData?.stats || [];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3 font-serif">Statistik Layanan</h2>
          <p className="text-muted-foreground">Transparansi kinerja layanan PPID Kabupaten Sorong</p>
        </div>

        {isLoading ? (
          <div className="text-center text-muted-foreground">Memuat statistik...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = iconMap[stat.icon] || TrendingUp;
              return (
                <Card key={index} className="p-6" data-testid={`stat-${stat.label.toLowerCase().replace(/\s+/g, '-')}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-2 rounded-lg ${colorBgMap[stat.color] || 'bg-primary/10'}`}>
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
        )}
      </div>
    </section>
  );
}
