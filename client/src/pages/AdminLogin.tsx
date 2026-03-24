import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Shield, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

const loginSchema = z.object({
  email: z.string().email("Voer een geldig e-mailadres in"),
  password: z.string().min(1, "Wachtwoord is verplicht"),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function AdminLogin() {
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const mutation = useMutation({
    mutationFn: async (data: LoginValues) => {
      const res = await apiRequest("POST", "/api/admin/login", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.setQueryData(["/api/admin/status"], { isAdmin: true });
      toast({ title: "Ingelogd als admin" });
      navigate("/admin");
    },
    onError: () => {
      toast({
        title: "Inloggen mislukt",
        description: "Controleer je e-mailadres en wachtwoord.",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="min-h-screen flex flex-col">
      <div className="relative overflow-hidden py-12">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-1/3 h-48 w-48 rounded-full bg-purple-600/20 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-48 w-48 rounded-full bg-pink-500/15 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-md px-4 md:px-6">
          <Link href="/">
            <Button variant="ghost" className="text-white/60 hover:text-white hover:bg-white/10 mb-4 -ml-2" data-testid="button-back">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Terug
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-purple-400" />
            <h1 className="text-3xl font-black text-white tracking-tight" data-testid="text-login-title">
              Admin <span className="gradient-text">Login</span>
            </h1>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-md px-4 md:px-6 -mt-4 pb-16">
        <div className="glass-card rounded-xl p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} className="space-y-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/80 font-bold">E-mailadres</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="admin@voorbeeld.nl" className="glass-input" {...field} data-testid="input-email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/80 font-bold">Wachtwoord</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Wachtwoord" className="glass-input" {...field} data-testid="input-password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold border-0 glow-purple"
                disabled={mutation.isPending}
                data-testid="button-login"
              >
                {mutation.isPending ? "Bezig..." : "Inloggen"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
