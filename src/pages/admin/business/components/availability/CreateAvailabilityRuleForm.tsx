import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Loader2 } from "lucide-react";
import { sileo } from "sileo";

import { useCreateAvailabilityRuleMutation } from "@/queries/availability-rule/post";
import { useAddCourtAvailabilityMutation } from "@/queries/court-availability/post";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  name: z.string().min(1, "Requerido"),
  dayOfWeek: z.string().min(1, "Requerido"),
  startTime: z.string().min(1, "Requerido"),
  endTime: z.string().min(1, "Requerido"),
});

type TFormValues = z.infer<typeof formSchema>;

const DAY_LABELS = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
];

interface CreateAvailabilityRuleFormProps {
  businessId: string;
  courtId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function CreateAvailabilityRuleForm({
  businessId,
  courtId,
  onSuccess,
  onCancel,
}: CreateAvailabilityRuleFormProps) {
  const createRuleMutation = useCreateAvailabilityRuleMutation();
  const addCourtAvailabilityMutation = useAddCourtAvailabilityMutation();

  const form = useForm<TFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      dayOfWeek: "",
      startTime: "",
      endTime: "",
    },
  });

  async function onSubmit(values: TFormValues) {
    try {
      const rule = await createRuleMutation.mutateAsync({
        businessId,
        data: {
          name: values.name,
          dayOfWeek: parseInt(values.dayOfWeek),
          startTime: values.startTime,
          endTime: values.endTime,
        },
      });
      await addCourtAvailabilityMutation.mutateAsync({
        businessId,
        courtId,
        data: { ruleId: rule.id },
      });
      sileo.success({ title: "Regla creada y asignada a la cancha" });
      onSuccess();
    } catch {
      sileo.error({ title: "No se pudo crear la regla" });
    }
  }

  const isPending =
    createRuleMutation.isPending || addCourtAvailabilityMutation.isPending;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 pt-4 border-t"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: Mañana lunes" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dayOfWeek"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Día de la semana</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccioná un día" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {DAY_LABELS.map((label, i) => (
                      <SelectItem key={i} value={String(i)}>
                        {label}
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
            name="startTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hora de inicio</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hora de cierre</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex gap-2 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isPending}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="h-4 w-4 animate-spin mr-1" />}
            Crear regla
          </Button>
        </div>
      </form>
    </Form>
  );
}
