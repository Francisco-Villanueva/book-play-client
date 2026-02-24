import { useState } from "react";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { sileo } from "sileo";

import { useAvailabilityRulesByBusinessQuery } from "@/queries/availability-rule/get";
import { useDeleteAvailabilityRuleMutation } from "@/queries/availability-rule/delete";
import { useCourtAvailabilityQuery } from "@/queries/court-availability/get";
import { useAddCourtAvailabilityMutation } from "@/queries/court-availability/post";
import { useRemoveCourtAvailabilityMutation } from "@/queries/court-availability/delete";
import { useExceptionRulesByBusinessQuery } from "@/queries/exception-rule/get";
import { useUpdateExceptionRuleMutation } from "@/queries/exception-rule/patch";
import { useDeleteExceptionRuleMutation } from "@/queries/exception-rule/delete";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { CreateAvailabilityRuleForm } from "./CreateAvailabilityRuleForm";
import { CreateExceptionRuleForm } from "./CreateExceptionRuleForm";

const DAY_LABELS = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
];

interface CourtAvailabilityDialogProps {
  courtId: string;
  courtName: string;
  businessId: string;
  open: boolean;
  onClose: () => void;
}

export function CourtAvailabilityDialog({
  courtId,
  courtName,
  businessId,
  open,
  onClose,
}: CourtAvailabilityDialogProps) {
  const [showAvailabilityForm, setShowAvailabilityForm] = useState(false);
  const [showExceptionForm, setShowExceptionForm] = useState(false);
  const [deletingAvailabilityRuleId, setDeletingAvailabilityRuleId] = useState<string | null>(null);
  const [deletingExceptionRuleId, setDeletingExceptionRuleId] = useState<string | null>(null);

  const availabilityRulesQuery = useAvailabilityRulesByBusinessQuery(businessId);
  // GET /businesses/:bid/courts/:cid/availability-rules → returns TAvailabilityRule[]
  const courtAvailabilityQuery = useCourtAvailabilityQuery(businessId, courtId);
  const exceptionRulesQuery = useExceptionRulesByBusinessQuery(businessId);

  const addCourtAvailabilityMutation = useAddCourtAvailabilityMutation();
  const removeCourtAvailabilityMutation = useRemoveCourtAvailabilityMutation();
  const deleteAvailabilityRuleMutation = useDeleteAvailabilityRuleMutation();
  const updateExceptionRuleMutation = useUpdateExceptionRuleMutation();
  const deleteExceptionRuleMutation = useDeleteExceptionRuleMutation();

  // Rules assigned to this court (full rule objects returned by the API)
  const courtAvailabilityRules = courtAvailabilityQuery.data ?? [];
  const availabilityRules = availabilityRulesQuery.data ?? [];
  const exceptionRules = exceptionRulesQuery.data ?? [];

  function isRuleAssigned(ruleId: string) {
    return courtAvailabilityRules.some((r) => r.id === ruleId);
  }

  function isExceptionAssigned(ruleId: string) {
    const rule = exceptionRules.find((r) => r.id === ruleId);
    return rule?.courts?.some((c) => c.id === courtId) ?? false;
  }

  async function handleToggleException(ruleId: string) {
    const rule = exceptionRules.find((r) => r.id === ruleId);
    if (!rule) return;
    const currentCourtIds = rule.courts?.map((c) => c.id) ?? [];
    const assigned = isExceptionAssigned(ruleId);
    const newCourtIds = assigned
      ? currentCourtIds.filter((id) => id !== courtId)
      : [...currentCourtIds, courtId];
    try {
      await updateExceptionRuleMutation.mutateAsync({
        businessId,
        ruleId,
        data: { courtIds: newCourtIds },
      });
    } catch {
      sileo.error({ title: "No se pudo actualizar la asignación" });
    }
  }

  async function handleToggleAvailability(ruleId: string) {
    try {
      if (isRuleAssigned(ruleId)) {
        await removeCourtAvailabilityMutation.mutateAsync({ businessId, courtId, ruleId });
      } else {
        await addCourtAvailabilityMutation.mutateAsync({
          businessId,
          courtId,
          data: { ruleId },
        });
      }
    } catch {
      sileo.error({ title: "No se pudo actualizar la asignación" });
    }
  }

  async function handleDeleteAvailabilityRule(ruleId: string) {
    try {
      await deleteAvailabilityRuleMutation.mutateAsync({ businessId, ruleId });
      sileo.success({ title: "Regla eliminada" });
      setDeletingAvailabilityRuleId(null);
    } catch {
      sileo.error({ title: "No se pudo eliminar la regla" });
    }
  }

  async function handleDeleteExceptionRule(ruleId: string) {
    try {
      await deleteExceptionRuleMutation.mutateAsync({ businessId, ruleId });
      sileo.success({ title: "Excepción eliminada" });
      setDeletingExceptionRuleId(null);
    } catch {
      sileo.error({ title: "No se pudo eliminar la excepción" });
    }
  }

  function formatDate(dateStr: string) {
    const [year, month, day] = dateStr.split("-").map(Number);
    return new Intl.DateTimeFormat("es-AR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(year, month - 1, day));
  }

  const isLoading =
    availabilityRulesQuery.isLoading ||
    courtAvailabilityQuery.isLoading ||
    exceptionRulesQuery.isLoading;

  const isAvailabilityToggling =
    addCourtAvailabilityMutation.isPending ||
    removeCourtAvailabilityMutation.isPending;

  const isExceptionToggling = updateExceptionRuleMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Horarios — {courtName}</DialogTitle>
          <DialogDescription>
            Gestioná las reglas de disponibilidad y excepciones para esta
            cancha.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* ── Reglas semanales ─────────────────────────────────────── */}
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">
                  Reglas semanales
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1 h-7 text-xs"
                  onClick={() => setShowAvailabilityForm((v) => !v)}
                >
                  <Plus className="h-3 w-3" />
                  Nueva regla
                </Button>
              </div>

              {showAvailabilityForm && (
                <CreateAvailabilityRuleForm
                  businessId={businessId}
                  courtId={courtId}
                  onSuccess={() => setShowAvailabilityForm(false)}
                  onCancel={() => setShowAvailabilityForm(false)}
                />
              )}

              {availabilityRules.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No hay reglas semanales para este negocio.
                </p>
              ) : (
                <ul className="space-y-2">
                  {availabilityRules.map((rule) => {
                    const assigned = isRuleAssigned(rule.id);
                    const isDeleting = deletingAvailabilityRuleId === rule.id;

                    return (
                      <li
                        key={rule.id}
                        className="flex items-center justify-between gap-2 rounded-md border px-3 py-2 text-sm"
                      >
                        <div className="min-w-0 flex-1">
                          <span className="font-medium">{rule.name}</span>
                          <span className="text-muted-foreground ml-2">
                            {DAY_LABELS[rule.dayOfWeek]} ·{" "}
                            {rule.startTime.slice(0, 5)}–
                            {rule.endTime.slice(0, 5)}
                          </span>
                          <span
                            className={`ml-2 text-xs px-1.5 py-0.5 rounded-full font-medium ${
                              rule.isActive
                                ? "bg-green-100 text-green-700"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {rule.isActive ? "Activa" : "Inactiva"}
                          </span>
                        </div>

                        {isDeleting ? (
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-xs text-muted-foreground">
                              ¿Eliminar?
                            </span>
                            <Button
                              variant="destructive"
                              size="sm"
                              className="h-6 text-xs px-2"
                              disabled={deleteAvailabilityRuleMutation.isPending}
                              onClick={() =>
                                handleDeleteAvailabilityRule(rule.id)
                              }
                            >
                              {deleteAvailabilityRuleMutation.isPending && (
                                <Loader2 className="h-3 w-3 animate-spin mr-1" />
                              )}
                              Confirmar
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-6 text-xs px-2"
                              onClick={() =>
                                setDeletingAvailabilityRuleId(null)
                              }
                            >
                              Cancelar
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 shrink-0">
                            <Button
                              variant={assigned ? "outline" : "default"}
                              size="sm"
                              className="h-7 text-xs px-2"
                              disabled={isAvailabilityToggling}
                              onClick={() =>
                                handleToggleAvailability(rule.id)
                              }
                            >
                              {isAvailabilityToggling && (
                                <Loader2 className="h-3 w-3 animate-spin mr-1" />
                              )}
                              {assigned ? "Quitar" : "Asignar"}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-muted-foreground hover:text-destructive"
                              onClick={() =>
                                setDeletingAvailabilityRuleId(rule.id)
                              }
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>

            <hr />

            {/* ── Excepciones por fecha ─────────────────────────────────── */}
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">
                  Excepciones por fecha
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1 h-7 text-xs"
                  onClick={() => setShowExceptionForm((v) => !v)}
                >
                  <Plus className="h-3 w-3" />
                  Nueva excepción
                </Button>
              </div>

              {showExceptionForm && (
                <CreateExceptionRuleForm
                  businessId={businessId}
                  courtId={courtId}
                  onSuccess={() => setShowExceptionForm(false)}
                  onCancel={() => setShowExceptionForm(false)}
                />
              )}

              {exceptionRules.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No hay excepciones registradas para este negocio.
                </p>
              ) : (
                <ul className="space-y-2">
                  {exceptionRules.map((rule) => {
                    const assigned = isExceptionAssigned(rule.id);
                    const isDeleting = deletingExceptionRuleId === rule.id;

                    return (
                      <li
                        key={rule.id}
                        className="flex items-center justify-between gap-2 rounded-md border px-3 py-2 text-sm"
                      >
                        <div className="min-w-0 flex-1">
                          <span className="font-medium">
                            {formatDate(rule.date)}
                          </span>
                          <span className="text-muted-foreground ml-2">
                            {rule.startTime && rule.endTime
                              ? `${rule.startTime.slice(0, 5)}–${rule.endTime.slice(0, 5)}`
                              : "Todo el día"}
                          </span>
                          <span
                            className={`ml-2 text-xs px-1.5 py-0.5 rounded-full font-medium ${
                              rule.isAvailable
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {rule.isAvailable ? "Disponible" : "No disponible"}
                          </span>
                          {rule.reason && (
                            <span className="text-muted-foreground ml-2">
                              — {rule.reason}
                            </span>
                          )}
                        </div>

                        {isDeleting ? (
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-xs text-muted-foreground">
                              ¿Eliminar del negocio?
                            </span>
                            <Button
                              variant="destructive"
                              size="sm"
                              className="h-6 text-xs px-2"
                              disabled={deleteExceptionRuleMutation.isPending}
                              onClick={() =>
                                handleDeleteExceptionRule(rule.id)
                              }
                            >
                              {deleteExceptionRuleMutation.isPending && (
                                <Loader2 className="h-3 w-3 animate-spin mr-1" />
                              )}
                              Confirmar
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-6 text-xs px-2"
                              onClick={() => setDeletingExceptionRuleId(null)}
                            >
                              Cancelar
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 shrink-0">
                            <Button
                              variant={assigned ? "outline" : "default"}
                              size="sm"
                              className="h-7 text-xs px-2"
                              disabled={isExceptionToggling}
                              onClick={() => handleToggleException(rule.id)}
                            >
                              {isExceptionToggling && (
                                <Loader2 className="h-3 w-3 animate-spin mr-1" />
                              )}
                              {assigned ? "Quitar" : "Asignar"}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-muted-foreground hover:text-destructive"
                              onClick={() =>
                                setDeletingExceptionRuleId(rule.id)
                              }
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
