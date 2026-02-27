import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Trophy, Medal, ArrowLeft, ExternalLink, Crown } from "lucide-react";
import type { WebappWithScores } from "@shared/schema";

function PodiumCard({ webapp, rank }: { webapp: WebappWithScores; rank: number }) {
  const config: Record<number, { bg: string; border: string; icon: typeof Trophy; size: string; label: string }> = {
    1: { bg: "bg-gradient-to-br from-yellow-50 to-amber-50", border: "border-yellow-300", icon: Crown, size: "text-4xl md:text-5xl", label: "1e Plaats" },
    2: { bg: "bg-gradient-to-br from-gray-50 to-slate-100", border: "border-gray-300", icon: Medal, size: "text-3xl md:text-4xl", label: "2e Plaats" },
    3: { bg: "bg-gradient-to-br from-amber-50 to-orange-50", border: "border-amber-400", icon: Medal, size: "text-3xl md:text-4xl", label: "3e Plaats" },
  };
  const c = config[rank];

  return (
    <Card
      className={`relative p-6 ${c.bg} border-2 ${c.border}`}
      data-testid={`podium-${rank}`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <c.icon className={`h-6 w-6 ${rank === 1 ? "text-yellow-500" : rank === 2 ? "text-gray-400" : "text-amber-600"}`} />
          <span className="text-xs font-bold uppercase tracking-wider text-[#3B28A0]/40">
            {c.label}
          </span>
        </div>
        <div className={`${c.size} font-black text-[#3B28A0]`} data-testid={`podium-score-${rank}`}>
          {webapp.totalAvg.toFixed(1)}
        </div>
      </div>

      <h3 className="text-xl font-bold text-[#3B28A0] mb-1" data-testid={`podium-name-${rank}`}>
        {webapp.appName}
      </h3>
      <p className="text-sm text-[#3B28A0]/60 mb-3">{webapp.teamName}</p>
      <p className="text-sm text-[#3B28A0]/70 line-clamp-2 mb-4">{webapp.description}</p>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="text-center rounded-md bg-white/70 py-2">
          <div className="text-lg font-bold text-[#3B28A0]">{webapp.avgCriterium1.toFixed(1)}</div>
          <div className="text-[10px] text-[#3B28A0]/40 uppercase">Leswaarde</div>
        </div>
        <div className="text-center rounded-md bg-white/70 py-2">
          <div className="text-lg font-bold text-[#3B28A0]">{webapp.avgCriterium2.toFixed(1)}</div>
          <div className="text-[10px] text-[#3B28A0]/40 uppercase">Creatief</div>
        </div>
        <div className="text-center rounded-md bg-white/70 py-2">
          <div className="text-lg font-bold text-[#3B28A0]">{webapp.avgCriterium3.toFixed(1)}</div>
          <div className="text-[10px] text-[#3B28A0]/40 uppercase">Gamification</div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <a href={webapp.url} target="_blank" rel="noopener noreferrer" className="flex-1">
          <Button variant="outline" className="w-full border-[#3B28A0]/20 text-[#3B28A0]" data-testid={`podium-visit-${rank}`}>
            <ExternalLink className="mr-2 h-4 w-4" />
            Bekijk App
          </Button>
        </a>
        <Link href={`/stemmen/${webapp.id}`}>
          <Button className="bg-[#3B28A0]" data-testid={`podium-vote-${rank}`}>
            <Trophy className="mr-2 h-4 w-4" />
            Stem
          </Button>
        </Link>
      </div>
    </Card>
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
    <div className="min-h-screen bg-gradient-to-b from-[#EDEAFA] to-white pb-16">
      <div className="bg-[#3B28A0] py-12">
        <div className="mx-auto max-w-5xl px-4 md:px-6">
          <Link href="/">
            <Button variant="ghost" className="text-white/70 mb-4 -ml-2" data-testid="button-back">
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
          <p className="mt-2 text-white/60">
            De top 3 en alle scores op een rij.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 md:px-6 -mt-6">
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-md border border-[#3B28A0]/10 bg-white p-6">
                <Skeleton className="h-8 w-48 mb-2" />
                <Skeleton className="h-5 w-32 mb-4" />
                <Skeleton className="h-20 w-full" />
              </div>
            ))}
          </div>
        ) : sorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center rounded-md border border-[#3B28A0]/10 bg-white">
            <Trophy className="h-12 w-12 text-[#3B28A0]/20 mb-4" />
            <h3 className="text-lg font-bold text-[#3B28A0] mb-2">Nog geen scores</h3>
            <p className="text-sm text-[#3B28A0]/50 mb-6 max-w-sm">
              Er zijn nog geen apps ingediend of beoordeeld. Dien je app in en verzamel stemmen!
            </p>
            <Link href="/indienen">
              <Button className="bg-[#3B28A0]">App Indienen</Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h2 className="text-lg font-bold text-[#3B28A0] mb-4 flex items-center gap-2">
                <Crown className="h-5 w-5 text-yellow-500" />
                Top 3
              </h2>
              <div className="grid gap-4 md:grid-cols-3">
                {top3.map((webapp, i) => (
                  <PodiumCard key={webapp.id} webapp={webapp} rank={i + 1} />
                ))}
              </div>
              {top3.length < 3 && (
                <p className="text-sm text-[#3B28A0]/40 mt-3 text-center">
                  Er zijn nog {3 - top3.length} plek(ken) vrij in de top 3!
                </p>
              )}
            </div>

            {rest.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-[#3B28A0] mb-4">Alle Resultaten</h2>
                <div className="rounded-md border border-[#3B28A0]/10 bg-white overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full" data-testid="table-results">
                      <thead>
                        <tr className="border-b border-[#3B28A0]/10 bg-[#EDEAFA]/50">
                          <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-[#3B28A0]/50">#</th>
                          <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-[#3B28A0]/50">App</th>
                          <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-[#3B28A0]/50">Leswaarde</th>
                          <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-[#3B28A0]/50">Creatief</th>
                          <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-[#3B28A0]/50">Gamification</th>
                          <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-[#3B28A0]/50">Totaal</th>
                          <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-[#3B28A0]/50">Stemmen</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rest.map((webapp, i) => (
                          <tr
                            key={webapp.id}
                            className="border-b border-[#3B28A0]/5 last:border-0"
                            data-testid={`row-result-${webapp.id}`}
                          >
                            <td className="px-4 py-3 text-sm font-bold text-[#3B28A0]/40">{i + 4}</td>
                            <td className="px-4 py-3">
                              <div className="text-sm font-bold text-[#3B28A0]">{webapp.appName}</div>
                              <div className="text-xs text-[#3B28A0]/50">{webapp.teamName}</div>
                            </td>
                            <td className="px-4 py-3 text-center text-sm font-bold text-[#3B28A0]">{webapp.avgCriterium1.toFixed(1)}</td>
                            <td className="px-4 py-3 text-center text-sm font-bold text-[#3B28A0]">{webapp.avgCriterium2.toFixed(1)}</td>
                            <td className="px-4 py-3 text-center text-sm font-bold text-[#3B28A0]">{webapp.avgCriterium3.toFixed(1)}</td>
                            <td className="px-4 py-3 text-center text-sm font-black text-[#3B28A0]">{webapp.totalAvg.toFixed(1)}</td>
                            <td className="px-4 py-3 text-center text-xs text-[#3B28A0]/50">{webapp.voteCount}</td>
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
