import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Vote, Trophy } from "lucide-react";
import type { WebappWithScores } from "@shared/schema";

interface WebappCardProps {
  webapp: WebappWithScores;
  rank?: number;
}

function ScoreBar({ label, value, max }: { label: string; value: number; max: number }) {
  const percentage = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-[#002F94]/60 w-24 shrink-0 truncate">{label}</span>
      <div className="flex-1 h-2 rounded-full bg-[#EBF1FA] overflow-hidden">
        <div
          className="h-full rounded-full bg-[#002F94] transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-xs font-bold text-[#002F94] w-8 text-right">
        {value.toFixed(1)}
      </span>
    </div>
  );
}

export default function WebappCard({ webapp, rank }: WebappCardProps) {
  const rankColors: Record<number, string> = {
    1: "bg-yellow-400 text-yellow-900",
    2: "bg-gray-300 text-gray-700",
    3: "bg-amber-600 text-amber-100",
  };

  return (
    <Card
      className="group relative flex flex-col border-[#002F94]/10 bg-white p-0 hover-elevate"
      data-testid={`card-webapp-${webapp.id}`}
    >
      {rank && rank <= 3 && (
        <div className="absolute -top-3 -right-3 z-10">
          <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-black ${rankColors[rank]}`}>
            {rank}
          </div>
        </div>
      )}

      <div className="p-5 pb-3">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="min-w-0">
            <h3 className="text-lg font-bold text-[#002F94] truncate" data-testid={`text-appname-${webapp.id}`}>
              {webapp.appName}
            </h3>
            <p className="text-sm text-[#002F94]/60" data-testid={`text-teamname-${webapp.id}`}>
              {webapp.teamName}
            </p>
          </div>
          <div className="flex flex-col items-center shrink-0">
            <div className="text-2xl font-black text-[#002F94]" data-testid={`text-score-${webapp.id}`}>
              {webapp.totalAvg.toFixed(1)}
            </div>
            <div className="text-[10px] text-[#002F94]/50 uppercase tracking-wider">/ 6.0</div>
          </div>
        </div>

        <p className="text-sm text-[#002F94]/70 line-clamp-2 mb-4" data-testid={`text-description-${webapp.id}`}>
          {webapp.description}
        </p>

        <div className="space-y-2 mb-4">
          <ScoreBar label="Leswaarde" value={webapp.avgCriterium1} max={2} />
          <ScoreBar label="Creatieve Twist" value={webapp.avgCriterium2} max={2} />
          <ScoreBar label="Gamification" value={webapp.avgCriterium3} max={2} />
        </div>

        <div className="flex items-center gap-2 text-xs text-[#002F94]/50">
          <Vote className="h-3 w-3" />
          <span data-testid={`text-votes-${webapp.id}`}>{webapp.voteCount} {webapp.voteCount === 1 ? "stem" : "stemmen"}</span>
        </div>
      </div>

      <div className="mt-auto flex gap-2 p-3 pt-0">
        <a
          href={webapp.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1"
        >
          <Button
            variant="outline"
            className="w-full border-[#002F94]/20 text-[#002F94]/70"
            data-testid={`link-visit-${webapp.id}`}
          >
            <ExternalLink className="mr-2 h-3.5 w-3.5" />
            Bekijk App
          </Button>
        </a>
        <Link href={`/stemmen/${webapp.id}`}>
          <Button
            className="bg-[#002F94]"
            data-testid={`link-vote-${webapp.id}`}
          >
            <Trophy className="mr-2 h-3.5 w-3.5" />
            Stem
          </Button>
        </Link>
      </div>
    </Card>
  );
}
