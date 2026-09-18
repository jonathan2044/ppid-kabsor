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
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const menuItems = [
  {
    title: 'Dashboard',
    url: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: 'Pengaturan Website',
    url: '/admin/pengaturan',
    icon: Settings,
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
];

export function AdminSidebar() {
  const [location] = useLocation();
  const { user, logout } = useAuth();

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
            <span className="text-xs text-muted-foreground">Panel CMS</span>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Utama</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
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
            <p className="text-xs text-muted-foreground">{user?.role}</p>
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
