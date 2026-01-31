import { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Heart, 
  LayoutDashboard, 
  Users, 
  Calendar, 
  BarChart3,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

interface AdminLayoutProps {
  children: ReactNode;
}

const navItems = [
  { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/patients', icon: Users, label: 'Patients' },
  { href: '/admin/appointments', icon: Calendar, label: 'Appointments' },
  { href: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
];

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-hero flex items-center justify-center">
                <Heart className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-display font-semibold">Sheger Care</span>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-50 h-screen w-64 bg-sidebar border-r border-sidebar-border
        transform transition-transform duration-200 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-4 border-b border-sidebar-border">
            <div className="flex items-center justify-between">
              <Link to="/admin/dashboard" className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-hero flex items-center justify-center">
                  <Heart className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="font-display font-bold text-sidebar-foreground">Sheger Care</h1>
                  <p className="text-xs text-sidebar-foreground/60">Admin Panel</p>
                </div>
              </Link>
              <Button 
                variant="ghost" 
                size="icon" 
                className="lg:hidden"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map(item => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                    ${isActive 
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground' 
                      : 'text-sidebar-foreground hover:bg-sidebar-accent'
                    }
                  `}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* User & Logout */}
          <div className="p-4 border-t border-sidebar-border">
            <div className="mb-3 px-3 py-2 rounded-lg bg-sidebar-accent">
              <p className="text-sm font-medium text-sidebar-foreground">{user?.name}</p>
              <p className="text-xs text-sidebar-foreground/60 capitalize">{user?.role}</p>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleLogout}
                className="flex-1 justify-start gap-2 text-sidebar-foreground"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
            <Link 
              to="/"
              className="block mt-2 text-xs text-center text-sidebar-foreground/60 hover:text-sidebar-foreground"
            >
              View Public Website →
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen">
        <div className="p-4 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};
