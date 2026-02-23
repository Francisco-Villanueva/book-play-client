import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowRight,
  Loader2,
  CheckCircle2,
  Zap,
  Calendar,
  Users,
} from "lucide-react";
import z from "zod";

import type { TBusiness, TCreateBusinessInput } from "@/models/business.model";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateBusinessMutation } from "@/queries/business/post";

const formSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  description: z.string(),
  address: z.string(),
  phone: z.string(),
  email: z
    .string()
    .refine((v) => v === "" || z.string().email().safeParse(v).success, {
      message: "Email inválido",
    }),
  timezone: z.string().min(1, "La zona horaria es requerida"),
  slotDuration: z.string().min(1, "La duración del turno es requerida"),
});

type TBusinessForm = z.infer<typeof formSchema>;

const TIMEZONES = [
  { value: "America/Argentina/Buenos_Aires", label: "Buenos Aires (GMT-3)" },
  { value: "America/Bogota", label: "Bogotá (GMT-5)" },
  { value: "America/Lima", label: "Lima (GMT-5)" },
  { value: "America/Santiago", label: "Santiago (GMT-4/-3)" },
  { value: "America/Montevideo", label: "Montevideo (GMT-3)" },
  { value: "America/Asuncion", label: "Asunción (GMT-4/-3)" },
  { value: "America/La_Paz", label: "La Paz (GMT-4)" },
  { value: "America/Guayaquil", label: "Guayaquil (GMT-5)" },
  { value: "America/Caracas", label: "Caracas (GMT-4)" },
  { value: "America/Mexico_City", label: "Ciudad de México (GMT-6/-5)" },
  { value: "America/New_York", label: "Nueva York (GMT-5/-4)" },
  { value: "America/Chicago", label: "Chicago (GMT-6/-5)" },
  { value: "America/Los_Angeles", label: "Los Ángeles (GMT-8/-7)" },
  { value: "Europe/Madrid", label: "Madrid (GMT+1/+2)" },
  { value: "Europe/London", label: "Londres (GMT+0/+1)" },
  { value: "UTC", label: "UTC (GMT+0)" },
];

const SLOT_DURATIONS = [
  { value: "30", label: "30 min" },
  { value: "60", label: "60 min — 1 hora" },
  { value: "90", label: "90 min — 1h 30min" },
  { value: "120", label: "120 min — 2 horas" },
];

type CreatedBusiness = { id: string; name: string; createdAt: string };

// ── Section heading with numbered badge ──────────────────────────────────────
function SectionBadge({
  number,
  title,
  description,
}: {
  number: number;
  title: string;
  description?: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-7 h-7 rounded-full bg-primary/12 border border-primary/25 flex items-center justify-center shrink-0 mt-0.5">
        <span className="text-xs font-bold text-primary leading-none">
          {number}
        </span>
      </div>
      <div>
        <CardTitle className="text-[0.95rem] font-semibold">{title}</CardTitle>
        {description && (
          <CardDescription className="mt-0.5 text-xs">
            {description}
          </CardDescription>
        )}
      </div>
    </div>
  );
}

// ── Success screen ────────────────────────────────────────────────────────────
function SuccessScreen({ business }: { business: CreatedBusiness }) {
  const NEXT_STEPS = [
    { icon: Zap, text: "Agregá tus canchas y sus características" },
    { icon: Calendar, text: "Configurá disponibilidad y horarios" },
    { icon: Users, text: "Compartí el link de reservas con tus jugadores" },
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Hero card */}
        <div
          className="rounded-2xl p-8 text-center mb-4"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.60 0.20 146) 0%, oklch(0.45 0.18 152) 100%)",
          }}
        >
          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-white mb-1">
            ¡Negocio creado!
          </h1>
          <p className="text-emerald-100/80 text-sm">
            <span className="font-semibold text-white">{business.name}</span> ya
            está registrado en Book &amp; Play
          </p>
        </div>

        {/* Details card */}
        <Card className="mb-4 shadow-sm">
          <CardContent className="pt-5 pb-5 space-y-3">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                Nombre del negocio
              </p>
              <p className="font-semibold text-foreground">{business.name}</p>
            </div>
            <div className="h-px bg-border" />
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                ID del negocio
              </p>
              <p className="font-mono text-xs text-muted-foreground break-all bg-muted rounded-md px-3 py-2">
                {business.id}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Next steps */}
        <Card className="shadow-sm">
          <CardHeader className="pb-3 pt-5">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Próximos pasos
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 pb-5 space-y-3">
            {NEXT_STEPS.map(({ icon: Icon, text }, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <p className="text-sm text-foreground/80">{text}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export function CreateBusinessPage() {
  const [createdBusiness, setCreatedBusiness] =
    useState<CreatedBusiness | null>(null);

  const form = useForm<TBusinessForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      address: "",
      phone: "",
      email: "",
      timezone: "",
      slotDuration: "",
    },
  });

  const createBusinessMutation = useCreateBusinessMutation();
  const handleSubmit = (data: TBusinessForm) => {
    const payload: TCreateBusinessInput = {
      name: data.name,
      description: data.description || undefined,
      address: data.address || undefined,
      phone: data.phone || undefined,
      email: data.email || undefined,
      timezone: data.timezone,
      slotDuration: Number(data.slotDuration) as 30 | 60 | 90 | 120,
    };
    createBusinessMutation.mutate(payload, {
      onSuccess(data) {
        setCreatedBusiness(data as TBusiness);
      },
    });
  };

  if (createdBusiness) return <SuccessScreen business={createdBusiness} />;

  return (
    <div className="min-h-screen bg-background">
      {/* ── Content ── */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-5">
        {/* Page title */}
        <div className="pb-2">
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
            Crear negocio
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Completá los datos de tu complejo deportivo para empezar
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            {/* ── Section 1: Basic info ── */}
            <Card className="shadow-sm">
              <CardHeader className="pb-1 pt-5 px-6">
                <SectionBadge number={1} title="Información básica" />
              </CardHeader>
              <CardContent className="px-6 pb-6 pt-4 space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-foreground/80">
                        Nombre del negocio{" "}
                        <span className="text-primary">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Complejo Deportivo del Sur"
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
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-foreground/80">
                        Descripción{" "}
                        <span className="text-muted-foreground font-normal text-xs">
                          (opcional)
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="5 canchas de fútbol sintético con iluminación nocturna..."
                          className="resize-none"
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* ── Section 2: Contact info ── */}
            <Card className="shadow-sm">
              <CardHeader className="pb-1 pt-5 px-6">
                <SectionBadge number={2} title="Datos de contacto" />
              </CardHeader>
              <CardContent className="px-6 pb-6 pt-4 space-y-4">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-foreground/80">
                        Dirección{" "}
                        <span className="text-muted-foreground font-normal text-xs">
                          (opcional)
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Av. Libertad 1234, Buenos Aires"
                          className="h-11"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                            placeholder="+54 9 11 9876-5432"
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
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold text-foreground/80">
                          Email{" "}
                          <span className="text-muted-foreground font-normal text-xs">
                            (opcional)
                          </span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="contacto@negocio.com"
                            className="h-11"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* ── Section 3: Configuration ── */}
            <Card className="shadow-sm">
              <CardHeader className="pb-1 pt-5 px-6">
                <SectionBadge
                  number={3}
                  title="Configuración de turnos"
                  description="Estos ajustes controlan cómo se generan los turnos disponibles"
                />
              </CardHeader>
              <CardContent className="px-6 pb-6 pt-4 space-y-4">
                <FormField
                  control={form.control}
                  name="timezone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-foreground/80">
                        Zona horaria <span className="text-primary">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder="Seleccioná una zona horaria" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {TIMEZONES.map((tz) => (
                            <SelectItem key={tz.value} value={tz.value}>
                              {tz.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="slotDuration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-foreground/80">
                        Duración del turno{" "}
                        <span className="text-primary">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder="¿Cuánto dura cada turno?" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {SLOT_DURATIONS.map((slot) => (
                            <SelectItem key={slot.value} value={slot.value}>
                              {slot.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {createBusinessMutation.error && (
              <div className="rounded-lg bg-destructive/8 border border-destructive/20 px-4 py-3">
                <p className="text-sm text-destructive font-medium text-center">
                  {(createBusinessMutation.error as Error).message ||
                    "Error al crear el negocio. Intentá de nuevo."}
                </p>
              </div>
            )}

            {/* ── Submit ── */}
            <Button
              type="submit"
              className="w-full h-12 font-semibold text-base gap-2"
              size="lg"
              disabled={createBusinessMutation.isPending}
            >
              {createBusinessMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creando negocio...
                </>
              ) : (
                <>
                  Crear negocio
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>

            <p className="text-center text-xs text-muted-foreground pb-4">
              Campos con <span className="text-primary font-bold">*</span> son
              obligatorios
            </p>
          </form>
        </Form>
      </main>
    </div>
  );
}
