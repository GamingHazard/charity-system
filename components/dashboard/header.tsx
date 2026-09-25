'use client';

import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

type DashboardHeaderProps = {
  onMenuClick: () => void;
};

export function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="flex min-h-16 items-center justify-between gap-3 border-b border-border bg-card px-4 py-3 sm:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onMenuClick}
          aria-label="Open dashboard navigation"
        >
          <Menu />
        </Button>
        <h1 className="hidden truncate text-xl font-bold text-foreground sm:block">
          Dashboard
        </h1>
      </div>
      
      <div className="flex min-w-0 shrink-0 items-center gap-2 sm:gap-4">
        {user && (
          <>
            <div className="min-w-0 max-w-28 text-right sm:max-w-44">
              <p className="truncate text-sm font-medium text-foreground">{user.name}</p>
              <p className="hidden truncate text-xs text-foreground/60 sm:block">{user.email}</p>
            </div>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground sm:h-10 sm:w-10">
              {user.name.charAt(0).toUpperCase()}
            </div>
          </>
        )}
        <Button
          onClick={handleLogout}
          variant="outline"
          size="sm"
          className="shrink-0 border-primary px-2 text-primary hover:bg-primary/10 sm:px-3"
        >
          <span className="sm:hidden">Exit</span>
          <span className="hidden sm:inline">Logout</span>
        </Button>
      </div>
    </header>
  );
}
