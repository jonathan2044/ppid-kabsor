import { Link, useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Settings,
  FileText,
  HelpCircle,
  Images,
  FolderOpen,
  Inbox,
  LogOut,
  User,
  Users,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

type MenuItem = {
  title: string;
  url: string;
  icon: typeof LayoutDashboard;
  /** Hanya tampil untuk admin; operator tidak punya akses ke halaman ini. */
  adminOnly?: boolean;
};

const menuItems: MenuItem[] = [
  {
    title: 'Dashboard',
    url: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: 'Pengaturan Website',
    url: '/admin/pengaturan',
    icon: Settings,
    adminOnly: true,
  },
  {
    title: 'Berita',
    url: '/admin/berita',
    icon: FileText,
  },
  {
    title: 'FAQ',
    url: '/admin/faq',
    icon: HelpCircle,
  },
  {
    title: 'Galeri',
    url: '/admin/galeri',
    icon: Images,
  },
  {
    title: 'Informasi Publik',
    url: '/admin/informasi-publik',
    icon: FolderOpen,
  },
  {
    title: 'Permohonan',
    url: '/admin/permohonan',
    icon: Inbox,
  },
  {
    title: 'Kelola Pengguna',
    url: '/admin/pengguna',
    icon: Users,
  },
];

export function AdminSidebar() {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  const isAdmin = user?.role === 'admin';
  // Operator hanya melihat menu konten; halaman pengguna jadi "Akun Saya" (ganti password)
  const visibleItems = menuItems
    .filter((item) => isAdmin || !item.adminOnly)
    .map((item) =>
      item.url === '/admin/pengguna' && !isAdmin ? { ...item, title: 'Akun Saya' } : item,
    );

  const handleLogout = () => {
    logout();
    window.location.href = '/admin/login';
  };

  return (
    <Sidebar>
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">P</span>
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm">PPID Admin</span>
            <span className="text-xs text-sidebar-foreground/70">Panel CMS</span>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Utama</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {visibleItems.map((item) => {
                const isActive = location === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild className={isActive ? 'bg-sidebar-accent' : ''}>
                      <Link href={item.url} data-testid={`link-admin-${item.url.split('/').pop()}`}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
              {user?.nama_lengkap.charAt(0).toUpperCase() || 'A'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.nama_lengkap}</p>
            <p className="text-xs text-sidebar-foreground/70">{user?.role}</p>
          </div>
        </div>
        <div className="space-y-2">
          <Button
            variant="secondary"
            size="sm"
            className="w-full"
            onClick={() => window.open('/', '_blank')}
            data-testid="button-view-frontend"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Lihat Website
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={handleLogout}
            data-testid="button-logout"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
