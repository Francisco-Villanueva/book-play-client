import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Link, Navigate, useNavigate } from "react-router";
import { Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";

import {
  RegisterRequestSchema,
  type TRegisterRequest,
} from "@/models/auth.model";
import { AuthService } from "@/services/auth.service";
import { useAuth } from "@/context/auth.context";
import { AuthLayout } from "@/components/auth-layout";
import { sileo } from "sileo";

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

export function RegisterPage() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<TRegisterRequest>({
    resolver: zodResolver(RegisterRequestSchema),
    defaultValues: {
      name: "",
      userName: "",
      email: "",
      password: "",
      phone: "",
    },
  });

  const mutation = useMutation({
    mutationFn: AuthService.register,
    onSuccess: (data) => {
      sileo.success({ title: "¡Cuenta creada!", description: "Bienvenido a Book & Play" });
      login(data.accessToken);
      navigate("/businesses/new");
    },
    onError: (error) => {
      sileo.error({ title: (error as Error).message || "Error al crear la cuenta. Intentá de nuevo." });
    },
  });

  if (isAuthenticated) return <Navigate to="/businesses/new" replace />;

  return (
    <AuthLayout>
      <div className="space-y-7">
        {/* Header */}
        <div className="space-y-2">
          <h2 className="text-[1.85rem] font-extrabold tracking-tight text-foreground leading-tight">
            Creá tu cuenta
          </h2>
          <p className="text-muted-foreground text-[0.95rem]">
            Empezá a gestionar tu complejo deportivo hoy
          </p>
        </div>

        {/* Form */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
            className="space-y-4"
          >
            {/* Name + Username side by side */}
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-foreground/80">
                      Nombre
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Maria" className="h-11" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="userName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-foreground/80">
                      Usuario
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="marialopez"
                        className="h-11"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-foreground/80">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
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
                        placeholder="Mínimo 8 caracteres"
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

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-foreground/80">
                    Teléfono{" "}
                    <span className="text-muted-foreground font-normal text-xs">
                      (opcional)
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="+54 9 11 1234-5678"
                      className="h-11"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {mutation.error && (
              <div className="rounded-lg bg-destructive/8 border border-destructive/20 px-4 py-3">
                <p className="text-sm text-destructive font-medium">
                  {(mutation.error as Error).message ||
                    "Error al crear la cuenta. Intentá de nuevo."}
                </p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-11 font-semibold text-[0.95rem] gap-2 mt-1"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creando cuenta...
                </>
              ) : (
                <>
                  Crear cuenta
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </Form>

        {/* Footer link */}
        <p className="text-center text-sm text-muted-foreground">
          ¿Ya tenés cuenta?{" "}
          <Link
            to="/login"
            className="text-primary font-semibold hover:underline underline-offset-4"
          >
            Iniciar sesión
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
