'use client';

import Link from 'next/link';
import { UtensilsCrossed, Bell, PlusCircle, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/browse', label: 'Browse Food', icon: <Search className="h-4 w-4 mr-2" /> },
  { href: '/create-listing', label: 'Create Listing', icon: <PlusCircle className="h-4 w-4 mr-2" /> },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <UtensilsCrossed className="h-8 w-8 text-primary" />
          <span className="font-bold text-2xl text-primary">PlateShare</span>
        </Link>
        <nav className="flex flex-1 items-center space-x-4 lg:space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === link.href ? "text-primary" : "text-foreground/60"
              )}
            >
              {link.icon && <span className="sm:hidden">{link.icon}</span>}
              <span className="hidden sm:inline-flex items-center">{link.icon}{link.label}</span>
            </Link>
          ))}
        </nav>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" aria-label="Notifications">
            <Bell className="h-5 w-5" />
          </Button>
          {/* Placeholder for user profile/auth */}
          {/* <Button variant="outline">Login</Button> */}
        </div>
      </div>
    </header>
  );
}
