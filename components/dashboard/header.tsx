'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export function DashboardHeader() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-8">
      <div>
        <h1 className="text-xl font-bold text-foreground">Dashboard</h1>
      </div>
      
      <div className="flex items-center gap-4">
        {user && (
          <>
            <div className="text-right">
              <p className="text-sm font-medium text-foreground">{user.name}</p>
              <p className="text-xs text-foreground/60">{user.email}</p>
            </div>
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
          </>
        )}
        <Button
          onClick={handleLogout}
          variant="outline"
          size="sm"
          className="border-primary text-primary hover:bg-primary/10"
        >
          Logout
        </Button>
      </div>
    </header>
  );
}
