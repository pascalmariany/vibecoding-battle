import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Trophy, Medal, ArrowLeft, ExternalLink, Crown } from "lucide-react";
import type { WebappWithScores } from "@shared/schema";

function PodiumCard({ webapp, rank }: { webapp: WebappWithScores; rank: number }) {
  const config: Record<number, { border: string; glow: string; icon: typeof Trophy; size: string; label: string; accent: string }> = {
    1: { border: "border-yellow-400/40", glow: "shadow-[0_8px_40px_rgba(234,179,8,0.25)]", icon: Crown, size: "text-4xl md:text-5xl", label: "1e Plaats", accent: "text-yellow-400" },
    2: { border: "border-slate-400/30", glow: "shadow-[0_8px_40px_rgba(148,163,184,0.20)]", icon: Medal, size: "text-3xl md:text-4xl", label: "2e Plaats", accent: "text-slate-300" },
    3: { border: "border-amber-500/30", glow: "shadow-[0_8px_40px_rgba(245,158,11,0.20)]", icon: Medal, size: "text-3xl md:text-4xl", label: "3e Plaats", accent: "text-amber-400" },
  };
  const c = config[rank];

  return (
    <div
      className={`glass-card relative rounded-xl p-6 border ${c.border} ${c.glow} transition-all duration-300`}
      data-testid={`podium-${rank}`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <c.icon className={`h-6 w-6 ${c.accent}`} />
          <span className={`text-xs font-bold uppercase tracking-wider ${c.accent}/70`}>
            {c.label}
          </span>
        </div>
        <div className={`${c.size} font-black gradient-text`} data-testid={`podium-score-${rank}`}>
          {webapp.totalAvg.toFixed(1)}
        </div>
      </div>

      <h3 className="text-xl font-bold text-white mb-1" data-testid={`podium-name-${rank}`}>
        {webapp.appName}
      </h3>
      <p className="text-sm text-purple-300/70 mb-3">{webapp.teamName}</p>
      <p className="text-sm text-white/55 line-clamp-2 mb-4">{webapp.description}</p>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="text-center rounded-lg glass py-2">
          <div className="text-lg font-bold text-white">{webapp.avgCriterium1.toFixed(1)}</div>
          <div className="text-[10px] text-white/40 uppercase">Leswaarde</div>
        </div>
        <div className="text-center rounded-lg glass py-2">
          <div className="text-lg font-bold text-white">{webapp.avgCriterium2.toFixed(1)}</div>
          <div className="text-[10px] text-white/40 uppercase">Creatief</div>
        </div>
        <div className="text-center rounded-lg glass py-2">
          <div className="text-lg font-bold text-white">{webapp.avgCriterium3.toFixed(1)}</div>
          <div className="text-[10px] text-white/40 uppercase">Gamification</div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <a href={webapp.url} target="_blank" rel="noopener noreferrer" className="flex-1">
          <Button
            variant="outline"
            className="w-full border-white/15 text-white/60 hover:text-white hover:border-white/30 hover:bg-white/10 bg-transparent"
            data-testid={`podium-visit-${rank}`}
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            Bekijk App
          </Button>
        </a>
        <Link href={`/stemmen/${webapp.id}`}>
          <Button
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white border-0"
            data-testid={`podium-vote-${rank}`}
          >
            <Trophy className="mr-2 h-4 w-4" />
            Stem
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default function Scoreboard() {
  const { data: webapps, isLoading } = useQuery<WebappWithScores[]>({
    queryKey: ["/api/webapps"],
  });

  const sorted = webapps?.slice().sort((a, b) => b.totalAvg - a.totalAvg) || [];
  const top3 = sorted.slice(0, 3);
  const rest = sorted.slice(3);

  return (
    <div className="min-h-screen pb-16">
      <div className="relative overflow-hidden py-12">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-1/4 h-56 w-56 rounded-full bg-yellow-500/10 blur-3xl" />
          <div className="absolute bottom-0 left-1/4 h-48 w-48 rounded-full bg-purple-600/20 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-5xl px-4 md:px-6">
          <Link href="/">
            <Button variant="ghost" className="text-white/60 hover:text-white hover:bg-white/10 mb-4 -ml-2" data-testid="button-back">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Terug
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <Trophy className="h-8 w-8 text-yellow-400" />
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight" data-testid="text-scoreboard-title">
              Scorebord
            </h1>
          </div>
          <p className="mt-2 text-white/50">
            De top 3 en alle scores op een rij.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 md:px-6 -mt-4">
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="glass-card rounded-xl p-6">
                <Skeleton className="h-8 w-48 mb-2 bg-white/10" />
                <Skeleton className="h-5 w-32 mb-4 bg-white/10" />
                <Skeleton className="h-20 w-full bg-white/10" />
              </div>
            ))}
          </div>
        ) : sorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center glass-card rounded-xl">
            <Trophy className="h-12 w-12 text-white/20 mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">Nog geen scores</h3>
            <p className="text-sm text-white/45 mb-6 max-w-sm">
              Er zijn nog geen apps ingediend of beoordeeld. Dien je app in en verzamel stemmen!
            </p>
            <Link href="/indienen">
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white border-0">
                App Indienen
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Crown className="h-5 w-5 text-yellow-400" />
                Top 3
              </h2>
              <div className="grid gap-4 md:grid-cols-3">
                {top3.map((webapp, i) => (
                  <PodiumCard key={webapp.id} webapp={webapp} rank={i + 1} />
                ))}
              </div>
              {top3.length < 3 && (
                <p className="text-sm text-white/30 mt-3 text-center">
                  Er zijn nog {3 - top3.length} plek(ken) vrij in de top 3!
                </p>
              )}
            </div>

            {rest.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-white mb-4">Alle Resultaten</h2>
                <div className="glass-card rounded-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full" data-testid="table-results">
                      <thead>
                        <tr className="border-b border-white/10 bg-white/5">
                          <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-white/40">#</th>
                          <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-white/40">App</th>
                          <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-white/40">Leswaarde</th>
                          <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-white/40">Creatief</th>
                          <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-white/40">Gamification</th>
                          <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-white/40">Totaal</th>
                          <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-white/40">Stemmen</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rest.map((webapp, i) => (
                          <tr
                            key={webapp.id}
                            className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors"
                            data-testid={`row-result-${webapp.id}`}
                          >
                            <td className="px-4 py-3 text-sm font-bold text-white/30">{i + 4}</td>
                            <td className="px-4 py-3">
                              <div className="text-sm font-bold text-white">{webapp.appName}</div>
                              <div className="text-xs text-purple-300/60">{webapp.teamName}</div>
                            </td>
                            <td className="px-4 py-3 text-center text-sm font-bold text-white">{webapp.avgCriterium1.toFixed(1)}</td>
                            <td className="px-4 py-3 text-center text-sm font-bold text-white">{webapp.avgCriterium2.toFixed(1)}</td>
                            <td className="px-4 py-3 text-center text-sm font-bold text-white">{webapp.avgCriterium3.toFixed(1)}</td>
                            <td className="px-4 py-3 text-center text-sm font-black gradient-text">{webapp.totalAvg.toFixed(1)}</td>
                            <td className="px-4 py-3 text-center text-xs text-white/40">{webapp.voteCount}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
