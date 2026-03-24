import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/20 backdrop-blur-sm py-6 mt-auto">
      <div className="mx-auto max-w-6xl px-4 md:px-6 flex items-center justify-between gap-4">
        <p className="text-xs text-white/25">
          Onderwijsorakel
        </p>
        <Link href="/admin/login">
          <span className="text-xs text-white/20 cursor-pointer transition-colors hover:text-white/40" data-testid="link-admin-hq">
            Admin HQ
          </span>
        </Link>
      </div>
    </footer>
  );
}
