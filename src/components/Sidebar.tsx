import {
  Home,
  Timer,
  ScrollText,
  History,
  Menu,
  Settings as SettingsIcon,
  LogOut,
  X,
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Auto-collapse sidebar on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        // md breakpoint
        setIsCollapsed(false);
        setIsMobileMenuOpen(false); // Close mobile menu on resize
      } else {
        setIsCollapsed(false);
        setIsMobileMenuOpen(false);
      }
    };

    // Set initial state
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

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

  const isMobile = window.innerWidth < 768;

  return (
    <>
      {/* Mobile Hamburger Menu Button */}
      {isMobile && (
        <div className="fixed top-4 left-4 z-[60] md:hidden">
          <Button
            // variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="bg-card border shadow-lg"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>
        </div>
      )}

      {/* Mobile Menu Overlay */}
      {isMobile && isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          'relative border-r min-h-screen transition-all duration-300 ease-in-out bg-[var(--background)]',
          isCollapsed ? 'w-20' : 'w-64',
          // Hide sidebar on mobile when menu is closed
          isMobile && !isMobileMenuOpen && 'hidden md:block',
          // On mobile when open, make it fixed and above overlay
          isMobile && isMobileMenuOpen && 'fixed left-0 top-0 z-40 shadow-2xl'
        )}
      >
        <div className="flex flex-col min-h-screen">
          <div className="flex items-center h-16 px-4 border-b">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="ml-auto hidden md:block"
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
    </>
  );
}
