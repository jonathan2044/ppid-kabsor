import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, HelpCircle, Images, FolderOpen, Inbox, CheckCircle, Clock, XCircle } from 'lucide-react';

interface DashboardStats {
  total_permohonan: number;
  permohonan_menunggu: number;
  permohonan_diproses: number;
  permohonan_selesai: number;
  permohonan_ditolak: number;
  total_berita: number;
  total_faq: number;
  total_galeri: number;
  total_informasi_publik: number;
}

export default function AdminDashboardPage() {
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ['admin-dashboard-stats'],
    queryFn: async () => {
      console.log('🔍 [Admin Dashboard] Fetching content stats...');
      const response = await fetch('/api/stats/content-stats');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      console.log('✅ [Admin Dashboard] Content stats loaded:', result);
      return result;
    },
  });

  const statCards = [
    {
      title: 'Total Permohonan',
      value: stats?.total_permohonan || 0,
      icon: Inbox,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950',
    },
    {
      title: 'Menunggu Proses',
      value: stats?.permohonan_menunggu || 0,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50 dark:bg-yellow-950',
    },
    {
      title: 'Sedang Diproses',
      value: stats?.permohonan_diproses || 0,
      icon: CheckCircle,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-950',
    },
    {
      title: 'Selesai',
      value: stats?.permohonan_selesai || 0,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-950',
    },
    {
      title: 'Ditolak',
      value: stats?.permohonan_ditolak || 0,
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50 dark:bg-red-950',
    },
  ];

  const contentCards = [
    {
      title: 'Berita',
      value: stats?.total_berita || 0,
      icon: FileText,
      color: 'text-blue-600',
    },
    {
      title: 'FAQ',
      value: stats?.total_faq || 0,
      icon: HelpCircle,
      color: 'text-purple-600',
    },
    {
      title: 'Galeri',
      value: stats?.total_galeri || 0,
      icon: Images,
      color: 'text-green-600',
    },
    {
      title: 'Informasi Publik',
      value: stats?.total_informasi_publik || 0,
      icon: FolderOpen,
      color: 'text-orange-600',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard Admin</h1>
        <p className="text-muted-foreground mt-1">Selamat datang di panel administrasi PPID Kabupaten Sorong</p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Permohonan Informasi</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {statCards.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className={`${stat.bgColor} p-2 rounded-lg`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid={`stat-${stat.title.toLowerCase().replace(/\s+/g, '-')}`}>
                  {stat.value}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Konten Website</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {contentCards.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid={`stat-${stat.title.toLowerCase()}`}>
                  {stat.value}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
