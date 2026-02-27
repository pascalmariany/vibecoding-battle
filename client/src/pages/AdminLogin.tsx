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
    onSuccess: (data) => {
      queryClient.setQueryData(["/api/admin/status"], { isAdmin: true });
      toast({ title: "Ingelogd als admin" });
      navigate("/admin");
    },
    onError: (error: Error) => {
      toast({
        title: "Inloggen mislukt",
        description: "Controleer je e-mailadres en wachtwoord.",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#EDEAFA] to-white">
      <div className="bg-[#3B28A0] py-12">
        <div className="mx-auto max-w-md px-4 md:px-6">
          <Link href="/">
            <Button variant="ghost" className="text-white/70 mb-4 -ml-2" data-testid="button-back">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Terug
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-white/80" />
            <h1 className="text-3xl font-black text-white tracking-tight" data-testid="text-login-title">
              Admin Login
            </h1>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-md px-4 md:px-6 -mt-6">
        <div className="rounded-md border border-[#3B28A0]/10 bg-white p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} className="space-y-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#3B28A0] font-bold">E-mailadres</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="admin@voorbeeld.nl" {...field} data-testid="input-email" />
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
                    <FormLabel className="text-[#3B28A0] font-bold">Wachtwoord</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Wachtwoord" {...field} data-testid="input-password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full bg-[#3B28A0] font-bold"
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
