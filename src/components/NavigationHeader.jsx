'use client';

import Link from "next/link";
import { Star, Search } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CreateNotesButton from './CreateNotesButton';
import ProfileDropdown from './ProfileDropdown';
import { useAuth } from "@/contexts/AuthContext";
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export function NavigationHeader() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const pathname = usePathname();
  
  // Don't render anything if we're still loading the auth state
  if (isLoading) {
    return null;
  }
  
  // Don't show navigation header on login/register pages
  if (['/login', '/register'].includes(pathname)) {
    return null;
  }
  
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Star className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">NoteShare</span>
          </Link>
          {isAuthenticated && (
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <Link href="/" className="transition-colors hover:text-foreground/80 text-foreground">
                Home
              </Link>
              <Link href="/notes" className="transition-colors hover:text-foreground/80 text-foreground/60">
                View All Notes
              </Link>
              <Link href="/explore" className="transition-colors hover:text-foreground/80 text-foreground/60">
                Explore
              </Link>
              <Link href="/notifications" className="transition-colors hover:text-foreground/80 text-foreground/60">
                Notifications
              </Link>
            </nav>
          )}
        </div>
        
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          {isAuthenticated ? (
            <>
              <div className="w-full flex-1 md:w-auto md:flex-none">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search..."
                    className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
                  />
                </div>
              </div>
              <CreateNotesButton />
              <ProfileDropdown currentUser={user} />
            </>
          ) : (
            <div className="flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <Link href="/login">Log in</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Sign up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
