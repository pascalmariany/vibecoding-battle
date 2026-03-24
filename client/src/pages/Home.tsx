import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PlusCircle, Trophy, Zap } from "lucide-react";
import WebappCard from "@/components/WebappCard";
import type { WebappWithScores } from "@shared/schema";

export default function Home() {
  const { data: webapps, isLoading } = useQuery<WebappWithScores[]>({
    queryKey: ["/api/webapps"],
  });

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden py-16 md:py-24">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-10 h-72 w-72 rounded-full bg-purple-600/20 blur-3xl" />
          <div className="absolute bottom-10 right-20 h-56 w-56 rounded-full bg-pink-500/20 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-indigo-600/15 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 md:px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-sm text-white/70 mb-6">
            <Zap className="h-4 w-4 text-pink-400" />
            <span>Onderwijsorakel</span>
          </div>

          <h1
            className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-4 tracking-tight"
            data-testid="text-hero-title"
          >
            Vibe Coden <span className="gradient-text">Battle</span>
          </h1>

          <p className="mx-auto max-w-2xl text-lg md:text-xl text-white/60 mb-8" data-testid="text-hero-subtitle">
            Bekijk de ingediende web apps, stem op je favorieten en help de beste top 3 te kiezen!
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/indienen">
              <Button
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold px-6 border-0 glow-purple"
                data-testid="button-hero-submit"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                App Indienen
              </Button>
            </Link>
            <Link href="/scorebord">
              <Button
                variant="outline"
                className="glass border-white/20 text-white font-bold px-6 hover:bg-white/10"
                data-testid="button-hero-scoreboard"
              >
                <Trophy className="mr-2 h-4 w-4" />
                Scorebord
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="relative -mt-4 mx-auto max-w-6xl px-4 md:px-6">
        <div className="mb-8 flex items-center justify-between gap-4 glass-card rounded-xl p-4">
          <div>
            <h2 className="text-xl font-bold text-white" data-testid="text-section-title">
              Ingediende Web Apps
            </h2>
            <p className="text-sm text-white/40">
              {isLoading
                ? "Laden..."
                : `${webapps?.length || 0} ${webapps?.length === 1 ? "app" : "apps"} ingediend`}
            </p>
          </div>
          <Link href="/indienen">
            <Button
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white border-0"
              data-testid="button-submit-app"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">App Indienen</span>
              <span className="sm:hidden">Indienen</span>
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 pb-16">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="glass-card rounded-xl p-5">
                <Skeleton className="mb-2 h-5 w-3/4 bg-white/10" />
                <Skeleton className="mb-4 h-4 w-1/2 bg-white/10" />
                <Skeleton className="mb-4 h-12 w-full bg-white/10" />
                <Skeleton className="mb-2 h-2 w-full bg-white/10" />
                <Skeleton className="mb-2 h-2 w-full bg-white/10" />
                <Skeleton className="h-2 w-full bg-white/10" />
              </div>
            ))}
          </div>
        ) : webapps && webapps.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 pb-16">
            {webapps.map((webapp) => (
              <WebappCard key={webapp.id} webapp={webapp} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center glass-card rounded-xl">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-500/20 border border-purple-500/30">
              <PlusCircle className="h-8 w-8 text-purple-400" />
            </div>
            <h3 className="mb-2 text-lg font-bold text-white" data-testid="text-empty-title">
              Nog geen apps ingediend
            </h3>
            <p className="mb-6 max-w-sm text-sm text-white/50">
              Wees de eerste! Dien je web app in en laat je mede-studenten stemmen.
            </p>
            <Link href="/indienen">
              <Button
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white border-0"
                data-testid="button-empty-submit"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Eerste App Indienen
              </Button>
            </Link>
          </div>
        )}
      </section>

      <section className="border-t border-white/10 bg-black/20 backdrop-blur-sm py-12 mt-8">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <h2 className="text-xl font-bold text-white mb-6 text-center" data-testid="text-criteria-title">
            Beoordelingscriteria
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="glass-card rounded-xl p-5">
              <div className="text-xs font-bold uppercase tracking-wider text-purple-400 mb-2">
                Criterium 1: Leswaarde (0-2)
              </div>
              <h3 className="text-base font-bold text-white mb-2">Leerdoel &amp; Student Output</h3>
              <p className="text-sm text-white/55 mb-3">
                Welk leerdoel wordt hiermee aantoonbaar beter gehaald? Wat levert de student op?
              </p>
              <ul className="space-y-1.5 text-xs text-white/50">
                <li><strong className="text-white/70">2 punten:</strong> Leerdoel en output heel concreet</li>
                <li><strong className="text-white/70">1 punt:</strong> Deels concreet</li>
                <li><strong className="text-white/70">0 punten:</strong> Vaag of vooral leuk</li>
              </ul>
            </div>

            <div className="glass-card rounded-xl p-5">
              <div className="text-xs font-bold uppercase tracking-wider text-pink-400 mb-2">
                Criterium 2: Creatieve Twist (0-2)
              </div>
              <h3 className="text-base font-bold text-white mb-2">Originele Invalshoek</h3>
              <p className="text-sm text-white/55 mb-3">
                Wat is de originele invalshoek die begrip/vaardigheid beter maakt?
              </p>
              <ul className="space-y-1.5 text-xs text-white/50">
                <li><strong className="text-white/70">2 punten:</strong> Creatief en functioneel voor leren</li>
                <li><strong className="text-white/70">1 punt:</strong> Klein creatief element</li>
                <li><strong className="text-white/70">0 punten:</strong> Standaard of gimmick</li>
              </ul>
            </div>

            <div className="glass-card rounded-xl p-5">
              <div className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2">
                Criterium 3: Gamification met Leerimpact (0-2)
              </div>
              <h3 className="text-base font-bold text-white mb-2">Game-Prikkel &amp; Leergedrag</h3>
              <p className="text-sm text-white/55 mb-3">
                Zorgt de game-prikkel voor meer oefening/feedback/doorzetten, zonder dat het afleidt?
              </p>
              <ul className="space-y-1.5 text-xs text-white/50">
                <li><strong className="text-white/70">2 punten:</strong> Game-element stuurt gewenst leergedrag</li>
                <li><strong className="text-white/70">1 punt:</strong> Game-element is leuk, maar leerimpact beperkt</li>
                <li><strong className="text-white/70">0 punten:</strong> Leidt af of beloont het verkeerde</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
