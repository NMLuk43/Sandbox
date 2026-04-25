"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, BookOpen, Scissors, Settings, Headphones } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/discover", label: "Discover", icon: Compass },
  { href: "/library", label: "Library", icon: BookOpen },
  { href: "/snips", label: "Snips", icon: Scissors },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 shrink-0 h-full flex flex-col border-r border-border/50 bg-card/30">
      {/* Logo */}
      <div className="p-5 pb-4">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-brand flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Headphones className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight text-foreground">Snipd</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-2 space-y-0.5">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== "/" && pathname.startsWith(href));
          return (
            <Link key={href} href={href}>
              <div className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
                active
                  ? "bg-brand-500/15 text-brand-300 border border-brand-500/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}>
                <Icon className={cn("w-4 h-4", active ? "text-brand-400" : "text-muted-foreground")} />
                {label}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom user area */}
      <div className="p-4 border-t border-border/50">
        <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-secondary cursor-pointer transition-colors group">
          <div className="w-8 h-8 rounded-full bg-gradient-brand flex items-center justify-center text-white text-xs font-bold">
            U
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-foreground truncate">My Account</div>
            <div className="text-xs text-muted-foreground truncate">Sign in</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
