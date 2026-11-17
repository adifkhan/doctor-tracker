'use client';

import { memo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { LogOut, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { NAV_ITEMS } from '@/lib/constants';
import { initials } from '@/lib/utils';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { baseApi } from '@/store/api/baseApi';
import { logout, selectUser } from '@/store/slices/authSlice';

const titleFor = (pathname: string) => {
  if (/^\/doctors\/[^/]+/.test(pathname)) return 'Doctor details';
  return NAV_ITEMS.find((item) => pathname.startsWith(item.href))?.label ?? 'Doctor Tracker';
};

export const Topbar = memo(function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);

  const handleLogout = () => {
    dispatch(logout());
    router.replace('/login');
    dispatch(baseApi.util.resetApiState());
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-card/90 px-4 backdrop-blur sm:px-6">
      <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick} aria-label="Open menu">
        <Menu />
      </Button>
      <h1 className="text-base font-semibold tracking-tight">{titleFor(pathname)}</h1>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="ml-auto flex items-center gap-2 rounded-full p-1 pr-1 transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:pr-3"
            aria-label="User menu"
          >
            <span className="flex size-8 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">
              {user ? initials(user.name) : <Skeleton className="size-4 rounded-full" />}
            </span>
            <span className="hidden text-sm font-medium sm:block">{user?.name}</span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>
            <p className="font-medium">{user?.name}</p>
            <p className="text-xs font-normal text-muted-foreground">{user?.email}</p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={handleLogout}>
            <LogOut />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
});
