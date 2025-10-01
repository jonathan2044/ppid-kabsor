import { Card } from '@/components/ui/card';
import { Calendar, AlertCircle, Clock, ShieldAlert, FileCheck } from 'lucide-react';
import { PapuaBorder } from './PapuaPattern';
import { useQuery } from '@tanstack/react-query';

interface Category {
  icon: string;
  title: string;
  description: string;
  count: string;
  href: string;
}

const iconMap: Record<string, any> = {
  Calendar,
  AlertCircle,
  Clock,
  ShieldAlert,
  FileCheck,
};

export function InfoCategories() {
  const { data: categoriesData, isLoading } = useQuery<{ categories: Category[] }>({
    queryKey: ['/api/stats/info-categories'],
  });

  const categories = categoriesData?.categories || [];

  return (
    <section className="py-16 bg-card/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3 font-serif">Kategori Informasi Publik</h2>
          <p className="text-muted-foreground">Akses berbagai kategori informasi sesuai kebutuhan Anda</p>
        </div>

        {isLoading ? (
          <div className="text-center text-muted-foreground">Memuat kategori...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => {
              const Icon = iconMap[category.icon] || Calendar;
              return (
                <Card
                  key={index}
                  className="p-6 hover-elevate active-elevate-2 cursor-pointer transition-all duration-200 overflow-visible group"
                  onClick={() => window.location.href = category.href}
                  data-testid={`category-${category.title.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <PapuaBorder className="mb-4" />
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-1">{category.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{category.description}</p>
                      <span className="text-xs font-medium text-gold">{category.count}</span>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
