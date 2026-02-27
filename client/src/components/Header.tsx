import { Link, useLocation } from "wouter";
import { Trophy, PlusCircle, BarChart3, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const navItems = [
  { href: "/", label: "Web Apps", icon: BarChart3 },
  { href: "/indienen", label: "Indienen", icon: PlusCircle },
  { href: "/scorebord", label: "Scorebord", icon: Trophy },
];

export default function Header() {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#002F94]/10 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 md:px-6">
        <Link href="/" data-testid="link-home">
          <div className="flex items-center gap-3 cursor-pointer">
            <img
              src="https://www.technovacollege.nl/themes/custom/cog/technova-logo.svg"
              alt="Technova College"
              className="h-10"
              data-testid="img-logo"
            />
            <div className="hidden sm:block">
              <span className="text-xs font-bold uppercase tracking-widest text-[#002F94]">
                Vibe Coden Battle
              </span>
            </div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1" data-testid="nav-desktop">
          {navItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={
                    isActive
                      ? "bg-[#002F94] text-white"
                      : "text-[#002F94]"
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
          className="md:hidden text-[#002F94]"
          onClick={() => setMobileOpen(!mobileOpen)}
          data-testid="button-mobile-menu"
        >
          {mobileOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-[#002F94]/10 bg-white px-4 pb-4 pt-2">
          <nav className="flex flex-col gap-1" data-testid="nav-mobile">
            {navItems.map((item) => {
              const isActive = location === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={`w-full justify-start ${
                      isActive
                        ? "bg-[#002F94] text-white"
                        : "text-[#002F94]"
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
