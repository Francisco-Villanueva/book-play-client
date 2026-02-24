import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Link, Navigate } from "react-router";
import { Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";

import { LoginRequestSchema, type TLoginRequest } from "@/models/auth.model";
import { AuthService } from "@/services/auth.service";
import { useAuth } from "@/context/auth.context";
import { AuthLayout } from "@/components/auth-layout";

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
import { sileo } from "sileo";

export function LoginPage() {
  const { isAuthenticated, login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<TLoginRequest>({
    resolver: zodResolver(LoginRequestSchema),
    defaultValues: { username: "", password: "" },
  });

  const mutation = useMutation({
    mutationFn: AuthService.login,
    onSuccess: (data) => {
      sileo.success({ title: "¡Bienvenido de vuelta!" });
      login(data.accessToken);

      location.replace("/admin");
    },
  });

  const onSubmit = (data: TLoginRequest) => {
    mutation.mutate(data);
  };

  if (isAuthenticated) return <Navigate to="/admin" replace />;

  return (
    <AuthLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h2 className="text-[1.85rem] font-extrabold tracking-tight text-foreground leading-tight">
            Bienvenido de vuelta
          </h2>
          <p className="text-muted-foreground text-[0.95rem]">
            Ingresá con tu email o nombre de usuario
          </p>
        </div>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-foreground/80">
                    Email o usuario
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="maria@email.com"
                      className="h-11"
                      {...field}
                    />
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
                  <FormLabel className="font-semibold text-foreground/80">
                    Contraseña
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Tu contraseña"
                        className="h-11 pr-11"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {mutation.error && (
              <div className="rounded-lg bg-destructive/8 border border-destructive/20 px-4 py-3">
                <p className="text-sm text-destructive font-medium">
                  {(mutation.error as Error).message ||
                    "Credenciales incorrectas. Intentá de nuevo."}
                </p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-11 font-semibold text-[0.95rem] gap-2"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Ingresando...
                </>
              ) : (
                <>
                  Iniciar sesión
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </Form>

        {/* Footer link */}
        <p className="text-center text-sm text-muted-foreground">
          ¿No tenés cuenta?{" "}
          <Link
            to="/register"
            className="text-primary font-semibold hover:underline underline-offset-4"
          >
            Registrate gratis
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
