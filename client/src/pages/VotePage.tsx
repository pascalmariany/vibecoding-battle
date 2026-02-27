import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute, Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import ScoreSlider from "@/components/ScoreSlider";
import { ArrowLeft, ExternalLink, Send, CheckCircle } from "lucide-react";
import type { WebappWithScores } from "@shared/schema";

const criteria = [
  {
    key: "criterium1" as const,
    label: "Leswaarde",
    description: "Welk leerdoel wordt hiermee aantoonbaar beter gehaald?",
    examples: [
      { score: 2, text: "Leerdoel en output heel concreet" },
      { score: 1, text: "Deels concreet" },
      { score: 0, text: "Vaag of vooral leuk" },
    ],
  },
  {
    key: "criterium2" as const,
    label: "Creatieve Twist",
    description: "Wat is de originele invalshoek die begrip/vaardigheid beter maakt?",
    examples: [
      { score: 2, text: "Creatief en functioneel voor leren" },
      { score: 1, text: "Klein creatief element" },
      { score: 0, text: "Standaard of gimmick" },
    ],
  },
  {
    key: "criterium3" as const,
    label: "Gamification met Leerimpact",
    description: "Zorgt de game-prikkel voor meer oefening/feedback/doorzetten?",
    examples: [
      { score: 2, text: "Game-element stuurt gewenst leergedrag" },
      { score: 1, text: "Game-element is leuk, maar leerimpact beperkt" },
      { score: 0, text: "Leidt af of beloont het verkeerde" },
    ],
  },
];

export default function VotePage() {
  const [, params] = useRoute("/stemmen/:id");
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [voterName, setVoterName] = useState("");
  const [scores, setScores] = useState({ criterium1: 0, criterium2: 0, criterium3: 0 });
  const [submitted, setSubmitted] = useState(false);

  const webappId = params?.id ? parseInt(params.id) : 0;

  const { data: webapp, isLoading } = useQuery<WebappWithScores>({
    queryKey: ["/api/webapps", webappId],
    enabled: webappId > 0,
  });

  const mutation = useMutation({
    mutationFn: async (data: { webappId: number; voterName: string; criterium1: number; criterium2: number; criterium3: number }) => {
      const res = await apiRequest("POST", "/api/votes", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/webapps"] });
      setSubmitted(true);
      toast({
        title: "Stem opgeslagen!",
        description: "Bedankt voor je beoordeling.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Fout bij stemmen",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = () => {
    if (!voterName.trim()) {
      toast({
        title: "Vul je naam in",
        description: "We willen weten wie er stemt.",
        variant: "destructive",
      });
      return;
    }
    mutation.mutate({
      webappId,
      voterName: voterName.trim(),
      ...scores,
    });
  };

  const totalScore = scores.criterium1 + scores.criterium2 + scores.criterium3;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#EDEAFA] to-white">
        <div className="bg-[#3B28A0] py-12">
          <div className="mx-auto max-w-2xl px-4 md:px-6">
            <Skeleton className="h-8 w-48 bg-white/20 mb-2" />
            <Skeleton className="h-5 w-64 bg-white/10" />
          </div>
        </div>
        <div className="mx-auto max-w-2xl px-4 md:px-6 -mt-6">
          <div className="rounded-md border border-[#3B28A0]/10 bg-white p-6">
            <Skeleton className="h-40 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!webapp) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#EDEAFA] to-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-[#3B28A0] mb-2">App niet gevonden</h2>
          <Link href="/">
            <Button className="bg-[#3B28A0]">Terug naar overzicht</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#EDEAFA] to-white">
        <div className="bg-[#3B28A0] py-12">
          <div className="mx-auto max-w-2xl px-4 md:px-6 text-center">
            <CheckCircle className="mx-auto h-16 w-16 text-green-400 mb-4" />
            <h1 className="text-3xl font-black text-white mb-2">Bedankt voor je stem!</h1>
            <p className="text-white/60">
              Je hebt {webapp.appName} een totaalscore van {totalScore}/6 gegeven.
            </p>
          </div>
        </div>
        <div className="mx-auto max-w-2xl px-4 md:px-6 -mt-6">
          <div className="rounded-md border border-[#3B28A0]/10 bg-white p-6 text-center">
            <p className="text-[#3B28A0]/60 mb-6">Wil je nog meer apps beoordelen?</p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link href="/">
                <Button className="bg-[#3B28A0]" data-testid="button-back-overview">
                  Terug naar Overzicht
                </Button>
              </Link>
              <Link href="/scorebord">
                <Button variant="outline" className="border-[#3B28A0]/20 text-[#3B28A0]" data-testid="button-to-scoreboard">
                  Bekijk Scorebord
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#EDEAFA] to-white pb-16">
      <div className="bg-[#3B28A0] py-12">
        <div className="mx-auto max-w-2xl px-4 md:px-6">
          <Link href="/">
            <Button variant="ghost" className="text-white/70 mb-4 -ml-2" data-testid="button-back">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Terug
            </Button>
          </Link>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight" data-testid="text-vote-title">
                {webapp.appName}
              </h1>
              <p className="mt-1 text-white/60">{webapp.teamName}</p>
            </div>
            <a
              href={webapp.url}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0"
            >
              <Button variant="outline" className="border-white/30 text-white" data-testid="button-visit-app">
                <ExternalLink className="mr-2 h-4 w-4" />
                Bekijk App
              </Button>
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 md:px-6 -mt-6">
        <div className="rounded-md border border-[#3B28A0]/10 bg-white p-6 mb-4">
          <p className="text-sm text-[#3B28A0]/70" data-testid="text-webapp-description">
            {webapp.description}
          </p>
        </div>

        <div className="mb-4">
          <label className="mb-2 block text-sm font-bold text-[#3B28A0]">
            Jouw naam
          </label>
          <Input
            placeholder="Vul je naam in..."
            value={voterName}
            onChange={(e) => setVoterName(e.target.value)}
            data-testid="input-voter-name"
          />
        </div>

        <div className="space-y-4 mb-6">
          {criteria.map((c) => (
            <ScoreSlider
              key={c.key}
              value={scores[c.key]}
              onChange={(val) => setScores((prev) => ({ ...prev, [c.key]: val }))}
              label={c.label}
              description={c.description}
              examples={c.examples}
            />
          ))}
        </div>

        <div className="sticky bottom-4 rounded-md border border-[#3B28A0]/10 bg-white p-4 flex items-center justify-between gap-4">
          <div>
            <div className="text-sm text-[#3B28A0]/50">Totaalscore</div>
            <div className="text-2xl font-black text-[#3B28A0]" data-testid="text-total-score">
              {totalScore} <span className="text-sm font-normal text-[#3B28A0]/40">/ 6</span>
            </div>
          </div>
          <Button
            className="bg-[#3B28A0] font-bold px-8"
            onClick={handleSubmit}
            disabled={mutation.isPending}
            data-testid="button-cast-vote"
          >
            {mutation.isPending ? (
              "Bezig..."
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Stem Opslaan
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
