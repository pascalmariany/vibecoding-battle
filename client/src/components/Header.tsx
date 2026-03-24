import { Link, useLocation } from "wouter";
import { Trophy, PlusCircle, BarChart3, Menu, X, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const navItems = [
  { href: "/", label: "Web Apps", icon: BarChart3 },
  { href: "/indienen", label: "Indienen", icon: PlusCircle },
  { href: "/scorebord", label: "Scorebord", icon: Trophy },
];

export default function Header() {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const { data: authStatus } = useQuery<{ isAdmin: boolean }>({
    queryKey: ["/api/admin/status"],
  });

  const allItems = authStatus?.isAdmin
    ? [...navItems, { href: "/admin", label: "Admin", icon: Shield }]
    : navItems;

  return (
    <header className="glass-header sticky top-0 z-50 w-full">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 md:px-6">
        <Link href="/" data-testid="link-home">
          <div className="flex items-center gap-3 cursor-pointer">
            <img
              src="/logo.png"
              alt="Onderwijsorakel"
              className="h-10 w-auto drop-shadow-lg"
              data-testid="img-logo"
            />
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
                      ? "bg-purple-600 text-white glow-purple border border-purple-400/30"
                      : "text-white/70 hover:text-white hover:bg-white/10"
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

        <Button
          size="icon"
          variant="ghost"
          className="md:hidden text-white/70 hover:text-white hover:bg-white/10"
          onClick={() => setMobileOpen(!mobileOpen)}
          data-testid="button-mobile-menu"
        >
          {mobileOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-white/10 bg-black/40 backdrop-blur-xl px-4 pb-4 pt-2">
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
                        : "text-white/70 hover:text-white hover:bg-white/10"
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
