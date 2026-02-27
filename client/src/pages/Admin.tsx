import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Shield, Trash2, ExternalLink, LogOut, ArrowLeft, Vote } from "lucide-react";
import type { WebappWithScores } from "@shared/schema";

export default function Admin() {
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const { data: authStatus, isLoading: authLoading, isFetched } = useQuery<{ isAdmin: boolean }>({
    queryKey: ["/api/admin/status"],
    staleTime: 0,
  });

  const { data: webapps, isLoading } = useQuery<WebappWithScores[]>({
    queryKey: ["/api/webapps"],
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/admin/logout");
    },
    onSuccess: () => {
      queryClient.setQueryData(["/api/admin/status"], { isAdmin: false });
      toast({ title: "Uitgelogd" });
      navigate("/");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/webapps/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/webapps"] });
      toast({ title: "Web app verwijderd" });
    },
    onError: (error: Error) => {
      toast({
        title: "Fout bij verwijderen",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleDelete = (id: number, name: string) => {
    if (window.confirm(`Weet je zeker dat je "${name}" wilt verwijderen? Dit verwijdert ook alle stemmen.`)) {
      deleteMutation.mutate(id);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#EDEAFA] to-white flex items-center justify-center">
        <Skeleton className="h-8 w-48" />
      </div>
    );
  }

  if (isFetched && !authStatus?.isAdmin) {
    navigate("/admin/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#EDEAFA] to-white pb-16">
      <div className="bg-[#3B28A0] py-12">
        <div className="mx-auto max-w-4xl px-4 md:px-6">
          <Link href="/">
            <Button variant="ghost" className="text-white/70 mb-4 -ml-2" data-testid="button-back">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Terug naar site
            </Button>
          </Link>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-white/80" />
              <div>
                <h1 className="text-3xl font-black text-white tracking-tight" data-testid="text-admin-title">
                  Admin Panel
                </h1>
                <p className="text-sm text-white/50">Beheer inzendingen</p>
              </div>
            </div>
            <Button
              variant="outline"
              className="border-white/30 text-white"
              onClick={() => logoutMutation.mutate()}
              data-testid="button-logout"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Uitloggen
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 md:px-6 -mt-6">
        <div className="rounded-md border border-[#3B28A0]/10 bg-white p-4 mb-6">
          <p className="text-sm text-[#3B28A0]/60">
            {isLoading ? "Laden..." : `${webapps?.length || 0} inzending(en) totaal`}
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-md" />
            ))}
          </div>
        ) : webapps && webapps.length > 0 ? (
          <div className="space-y-3">
            {webapps.map((webapp) => (
              <Card
                key={webapp.id}
                className="flex items-center justify-between gap-4 border-[#3B28A0]/10 bg-white p-4"
                data-testid={`admin-card-${webapp.id}`}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-bold text-[#3B28A0] truncate" data-testid={`admin-name-${webapp.id}`}>
                      {webapp.appName}
                    </h3>
                    <span className="text-xs text-[#3B28A0]/40 shrink-0">
                      {webapp.teamName}
                    </span>
                  </div>
                  <p className="text-sm text-[#3B28A0]/50 truncate mb-1">{webapp.description}</p>
                  <div className="flex items-center gap-4 text-xs text-[#3B28A0]/40">
                    <span className="flex items-center gap-1">
                      <Vote className="h-3 w-3" />
                      {webapp.voteCount} stemmen
                    </span>
                    <span>Score: {webapp.totalAvg.toFixed(1)}/6</span>
                    <a
                      href={webapp.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-[#3B28A0]/60 underline"
                      data-testid={`admin-link-${webapp.id}`}
                    >
                      <ExternalLink className="h-3 w-3" />
                      Bekijk
                    </a>
                  </div>
                </div>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleDelete(webapp.id, webapp.appName)}
                  disabled={deleteMutation.isPending}
                  data-testid={`button-delete-${webapp.id}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-[#3B28A0]/40">Geen inzendingen om te beheren.</p>
          </div>
        )}
      </div>
    </div>
  );
}
