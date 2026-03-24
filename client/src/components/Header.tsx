import { Link, useLocation } from "wouter";
import { Trophy, PlusCircle, BarChart3, Menu, X, Shield, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useTheme } from "@/hooks/use-theme";

const navItems = [
  { href: "/", label: "Web Apps", icon: BarChart3 },
  { href: "/indienen", label: "Indienen", icon: PlusCircle },
  { href: "/scorebord", label: "Scorebord", icon: Trophy },
];

export default function Header() {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const { data: authStatus } = useQuery<{ isAdmin: boolean }>({
    queryKey: ["/api/admin/status"],
  });

  const allItems = authStatus?.isAdmin
    ? [...navItems, { href: "/admin", label: "Admin", icon: Shield }]
    : navItems;

  const isDark = theme === "dark";

  return (
    <header className="glass-header sticky top-0 z-50 w-full">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-4 px-4 md:px-6">
        <Link href="/" data-testid="link-home">
          <div className="flex items-center gap-3 cursor-pointer">
            <img
              src="/logo.png"
              alt="Onderwijsorakel"
              className="h-14 w-auto drop-shadow-sm"
              data-testid="img-logo"
            />
            <div className="flex flex-col leading-tight">
              <span className="text-base font-black tracking-tight text-purple-900 dark:text-white">
                Vibe Coden Battle
              </span>
              <span className="text-[10px] font-medium text-purple-500/70 dark:text-white/40 uppercase tracking-widest">
                Onderwijsorakel
              </span>
            </div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1" data-testid="nav-desktop">
          {allItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={
                    isActive
                      ? "bg-purple-600 text-white hover:bg-purple-700 border-0"
                      : "text-purple-700 hover:text-purple-900 hover:bg-purple-50 dark:text-white/70 dark:hover:text-white dark:hover:bg-white/10"
                  }
                  data-testid={`nav-${item.label.toLowerCase()}`}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="ghost"
            className="text-purple-600 hover:text-purple-800 hover:bg-purple-50 dark:text-white/70 dark:hover:text-white dark:hover:bg-white/10"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            aria-label="Schakel thema"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          <Button
            size="icon"
            variant="ghost"
            className="md:hidden text-purple-600 hover:text-purple-800 hover:bg-purple-50 dark:text-white/70 dark:hover:text-white dark:hover:bg-white/10"
            onClick={() => setMobileOpen(!mobileOpen)}
            data-testid="button-mobile-menu"
          >
            {mobileOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-purple-100 dark:border-white/10 bg-white/90 dark:bg-black/40 backdrop-blur-xl px-4 pb-4 pt-2">
          <nav className="flex flex-col gap-1" data-testid="nav-mobile">
            {allItems.map((item) => {
              const isActive = location === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={`w-full justify-start ${
                      isActive
                        ? "bg-purple-600 text-white"
                        : "text-purple-700 hover:text-purple-900 hover:bg-purple-50 dark:text-white/70 dark:hover:text-white dark:hover:bg-white/10"
                    }`}
                    onClick={() => setMobileOpen(false)}
                    data-testid={`nav-mobile-${item.label.toLowerCase()}`}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
