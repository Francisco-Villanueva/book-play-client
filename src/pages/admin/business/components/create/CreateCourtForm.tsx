import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Loader2, X } from "lucide-react";
import { toast } from "sonner";

import { useCreateCourtMutation } from "@/queries/court/post";
import type { TCreateCourtInput } from "@/models/court.model";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ── Court form schema (plain string fields, booleans converted on submit) ─────
const courtFormSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  sportType: z.string(),
  surface: z.string(),
  capacity: z.string(),
  isIndoor: z.string().min(1, "Seleccioná una opción"),
  hasLighting: z.string().min(1, "Seleccioná una opción"),
  pricePerHour: z.string(),
  description: z.string(),
});

type TCourtForm = z.infer<typeof courtFormSchema>;
export function CreateCourtForm({
  businessId,
  onClose,
}: {
  businessId: string;
  onClose: () => void;
}) {
  const form = useForm<TCourtForm>({
    resolver: zodResolver(courtFormSchema),
    defaultValues: {
      name: "",
      sportType: "",
      surface: "",
      capacity: "",
      isIndoor: "",
      hasLighting: "",
      pricePerHour: "",
      description: "",
    },
  });

  const createCourt = useCreateCourtMutation();

  function handleSubmit(data: TCourtForm) {
    const payload: TCreateCourtInput = {
      name: data.name,
      sportType: data.sportType || undefined,
      surface: data.surface || undefined,
      capacity: data.capacity ? parseInt(data.capacity) : undefined,
      isIndoor: data.isIndoor === "true",
      hasLighting: data.hasLighting === "true",
      pricePerHour: data.pricePerHour
        ? parseFloat(data.pricePerHour)
        : undefined,
      description: data.description || undefined,
    };

    createCourt.mutate(
      { businessId, data: payload },
      {
        onSuccess: () => {
          toast.success("Cancha creada exitosamente");
          form.reset();
          onClose();
        },
        onError: () => {
          toast.error("Error al crear la cancha. Intentá de nuevo.");
        },
      },
    );
  }

  return (
    <Card className="shadow-sm border-primary/20">
      <CardHeader className="pb-1 pt-5 px-6">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base font-semibold">
              Nueva cancha
            </CardTitle>
            <CardDescription className="mt-0.5">
              Completá los datos de la cancha
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="-mt-1 -mr-2"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-6 pb-6 pt-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            {/* Nombre */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-foreground/80">
                    Nombre <span className="text-primary">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Cancha 1" className="h-10" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Deporte + Superficie */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="sportType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-foreground/80">
                      Deporte{" "}
                      <span className="text-muted-foreground font-normal text-xs">
                        (opcional)
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Fútbol 5"
                        className="h-10"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="surface"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-foreground/80">
                      Superficie{" "}
                      <span className="text-muted-foreground font-normal text-xs">
                        (opcional)
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Césped sintético"
                        className="h-10"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Cubierta + Iluminación */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="isIndoor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-foreground/80">
                      ¿Cubierta? <span className="text-primary">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Seleccioná" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="true">Sí</SelectItem>
                        <SelectItem value="false">No</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="hasLighting"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-foreground/80">
                      ¿Iluminación? <span className="text-primary">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Seleccioná" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="true">Sí</SelectItem>
                        <SelectItem value="false">No</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Capacidad + Precio */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-foreground/80">
                      Capacidad{" "}
                      <span className="text-muted-foreground font-normal text-xs">
                        (jugadores)
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        placeholder="10"
                        className="h-10"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pricePerHour"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-foreground/80">
                      Precio / hora{" "}
                      <span className="text-muted-foreground font-normal text-xs">
                        (opcional)
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        placeholder="5000"
                        className="h-10"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Descripción */}
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
                      placeholder="Cancha techada con iluminación LED..."
                      rows={2}
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {createCourt.error && (
              <div className="rounded-lg bg-destructive/8 border border-destructive/20 px-4 py-3">
                <p className="text-sm text-destructive font-medium text-center">
                  {(createCourt.error as Error).message ||
                    "Error al crear la cancha. Intentá de nuevo."}
                </p>
              </div>
            )}

            <div className="flex gap-2 justify-end pt-1">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={createCourt.isPending}
                className="gap-2"
              >
                {createCourt.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  "Guardar cancha"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
