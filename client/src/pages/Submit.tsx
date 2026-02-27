import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { insertWebappSchema } from "@shared/schema";
import { Send, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

const formSchema = insertWebappSchema.extend({
  teamName: z.string().min(2, "Teamnaam moet minstens 2 tekens bevatten"),
  appName: z.string().min(2, "App naam moet minstens 2 tekens bevatten"),
  description: z.string().min(10, "Beschrijving moet minstens 10 tekens bevatten"),
  url: z.string().url("Voer een geldige URL in (bijv. https://...)"),
});

type FormValues = z.infer<typeof formSchema>;

export default function Submit() {
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      teamName: "",
      appName: "",
      description: "",
      url: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const res = await apiRequest("POST", "/api/webapps", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/webapps"] });
      toast({
        title: "App ingediend!",
        description: "Je web app is succesvol toegevoegd. Anderen kunnen nu stemmen!",
      });
      navigate("/");
    },
    onError: (error: Error) => {
      toast({
        title: "Fout bij indienen",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormValues) => {
    mutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#EDEAFA] to-white">
      <div className="bg-[#3B28A0] py-12">
        <div className="mx-auto max-w-2xl px-4 md:px-6">
          <Link href="/">
            <Button variant="ghost" className="text-white/70 mb-4 -ml-2" data-testid="button-back-home">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Terug
            </Button>
          </Link>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight" data-testid="text-submit-title">
            App Indienen
          </h1>
          <p className="mt-2 text-white/60">
            Vul het formulier in om je web app in te dienen voor de Vibe Coden Battle.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 md:px-6 -mt-6">
        <div className="rounded-md border border-[#3B28A0]/10 bg-white p-6 md:p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="teamName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#3B28A0] font-bold">Teamnaam / Maker</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Bijv. Team Rocket, Jan & Piet..."
                        {...field}
                        data-testid="input-team-name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="appName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#3B28A0] font-bold">App Naam</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="De naam van je web app"
                        {...field}
                        data-testid="input-app-name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#3B28A0] font-bold">Beschrijving</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Wat doet je app? Welk leerdoel wordt ermee bereikt? Wat maakt het uniek?"
                        className="min-h-[120px] resize-none"
                        {...field}
                        data-testid="input-description"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#3B28A0] font-bold">URL van de App</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://jouw-app.replit.app"
                        {...field}
                        data-testid="input-url"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-[#3B28A0] font-bold"
                disabled={mutation.isPending}
                data-testid="button-submit"
              >
                {mutation.isPending ? (
                  "Bezig met indienen..."
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    App Indienen
                  </>
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
