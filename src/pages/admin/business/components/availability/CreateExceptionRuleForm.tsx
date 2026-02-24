import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Loader2 } from "lucide-react";
import { sileo } from "sileo";

import { useCreateExceptionRuleMutation } from "@/queries/exception-rule/post";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z
  .object({
    date: z.string().min(1, "Requerido"),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
    isAvailable: z.string(),
    reason: z.string().optional(),
  })
  .refine(
    (v) => {
      const hasStart = !!v.startTime;
      const hasEnd = !!v.endTime;
      return hasStart === hasEnd;
    },
    {
      message: "Debés ingresar hora de inicio y hora de cierre juntas, o dejar ambas vacías",
      path: ["endTime"],
    },
  );

type TFormValues = z.infer<typeof formSchema>;

interface CreateExceptionRuleFormProps {
  businessId: string;
  courtId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function CreateExceptionRuleForm({
  businessId,
  courtId,
  onSuccess,
  onCancel,
}: CreateExceptionRuleFormProps) {
  const createExceptionMutation = useCreateExceptionRuleMutation();

  const form = useForm<TFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: "",
      startTime: "",
      endTime: "",
      isAvailable: "false",
      reason: "",
    },
  });

  async function onSubmit(values: TFormValues) {
    try {
      await createExceptionMutation.mutateAsync({
        businessId,
        data: {
          date: values.date,
          startTime: values.startTime || undefined,
          endTime: values.endTime || undefined,
          isAvailable: values.isAvailable === "true",
          reason: values.reason || undefined,
          courtIds: [courtId],
        },
      });
      sileo.success({ title: "Excepción creada y asignada a la cancha" });
      onSuccess();
    } catch {
      sileo.error({ title: "No se pudo crear la excepción" });
    }
  }

  const isPending = createExceptionMutation.isPending;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 pt-4 border-t"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="isAvailable"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Disponibilidad</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="true">Disponible</SelectItem>
                    <SelectItem value="false">No disponible</SelectItem>
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
                <FormLabel>Hora inicio (opcional)</FormLabel>
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
                <FormLabel>Hora cierre (opcional)</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="reason"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>Motivo (opcional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Ej: Mantenimiento, feriado..."
                    {...field}
                  />
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
            Crear excepción
          </Button>
        </div>
      </form>
    </Form>
  );
}
