import { ReactNode, useEffect, type CSSProperties } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'wouter';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AdminSidebar } from './AdminSidebar';

interface AdminLayoutProps {
  children: ReactNode;
  /** Halaman yang hanya boleh dibuka admin, bukan operator. */
  requireAdmin?: boolean;
}

export function AdminLayout({ children, requireAdmin = false }: AdminLayoutProps) {
  const { isAuthenticated, isLoading, user, token } = useAuth();
  const [, navigate] = useLocation();

  // Token sudah ada tapi data pengguna belum: sesi masih disiapkan, bukan belum login
  const sesiBelumSiap = isLoading || (!!token && !user);

  useEffect(() => {
    if (!sesiBelumSiap && !isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, sesiBelumSiap, navigate]);

  if (sesiBelumSiap) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const ditolak = requireAdmin && user?.role !== 'admin';

  const style = {
    '--sidebar-width': '16rem',
    '--sidebar-width-icon': '3rem',
  };

  return (
    <SidebarProvider style={style as CSSProperties}>
      <div className="flex h-screen w-full bg-background">
        <AdminSidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="flex items-center justify-between px-6 py-3 border-b bg-card">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Admin Panel</span>
            </div>
          </header>
          <main className="flex-1 overflow-y-auto p-6">
            {ditolak ? (
              <div className="mx-auto max-w-lg rounded-lg border bg-card p-8 text-center">
                <h1 className="text-xl font-bold">Halaman ini khusus admin</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  Akun Anda terdaftar sebagai operator, yang dapat mengelola berita, FAQ, galeri,
                  informasi publik, dan permohonan. Hubungi admin bila Anda perlu akses ke halaman ini.
                </p>
              </div>
            ) : (
              children
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
