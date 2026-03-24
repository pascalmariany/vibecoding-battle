import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="border-t border-purple-100 dark:border-white/10 bg-white/60 dark:bg-black/20 backdrop-blur-sm py-6 mt-auto">
      <div className="mx-auto max-w-6xl px-4 md:px-6 flex items-center justify-between gap-4">
        <p className="text-xs text-purple-400/60 dark:text-white/25">
          Onderwijsorakel
        </p>
        <Link href="/admin/login">
          <span className="text-xs text-purple-300/70 dark:text-white/20 cursor-pointer transition-colors hover:text-purple-500 dark:hover:text-white/40" data-testid="link-admin-hq">
            Admin HQ
          </span>
        </Link>
      </div>
    </footer>
  );
}
