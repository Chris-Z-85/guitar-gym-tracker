import {
  Home,
  Timer,
  ScrollText,
  History,
  Menu,
  Settings as SettingsIcon,
  LogOut,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ThemeToggle } from '@/components/theme-toggle';
import { useAuth } from '@/lib/context/AuthProvider';
import { logOut } from '@/components/firebaseClient';
import { toast } from 'sonner';

const menuItems = [
  {
    title: 'Home',
    icon: <Home className="w-4 h-4" />,
    href: '/',
  },
  {
    title: 'Timer',
    icon: <Timer className="w-4 h-4" />,
    href: '/timer',
  },
  {
    title: 'Logger',
    icon: <ScrollText className="w-4 h-4" />,
    href: '/logger',
  },
  {
    title: 'History',
    icon: <History className="w-4 h-4" />,
    href: '/history',
  },
  {
    title: 'Settings',
    icon: <SettingsIcon className="w-4 h-4" />,
    href: '/settings',
  },
];

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { pathname } = useLocation();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Auto-collapse sidebar on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        // md breakpoint
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    };

    // Set initial state
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSignOut = async () => {
    try {
      await logOut();
      toast.success('Signed out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Error signing out');
      console.error(error);
    }
  };

  return (
    <div
      className={cn(
        'relative border-r bg-card min-h-screen transition-all duration-300 ease-in-out',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex flex-col min-h-screen">
        <div className="flex items-center h-16 px-4 border-b">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="ml-auto"
          >
            <Menu className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex-1 px-4 space-y-2 overflow-auto py-4">
          {menuItems.map(item => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground',
                pathname === item.href && 'bg-secondary text-foreground'
              )}
            >
              {item.icon}
              {!isCollapsed && <span>{item.title}</span>}
            </Link>
          ))}
        </div>

        <div className="flex flex-col gap-2 p-4 border-t">
          {user && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className={cn(
                'flex items-center gap-3 w-full justify-start',
                isCollapsed && 'justify-center'
              )}
            >
              <LogOut className="w-4 h-4" />
              {!isCollapsed && <span>Sign Out</span>}
            </Button>
          )}
          <ThemeToggle isCollapsed={isCollapsed} />
        </div>
      </div>
    </div>
  );
}
