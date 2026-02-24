import { useState, useMemo } from "react";
import { Ban, ChevronLeft, ChevronRight, Plus, RefreshCw } from "lucide-react";
import { sileo } from "sileo";

import { useBusinessQuery } from "@/queries/business/get";
import { useBookingsByBusinessQuery } from "@/queries/booking/get";
import { useCourtsByBusinessQuery } from "@/queries/court/get";
import { useCancelBookingMutation } from "@/queries/booking/patch";
import { useCreateBookingMutation } from "@/queries/booking/post";
import type { TBooking } from "@/models/booking.model";
import type { TCourt } from "@/models/court.model";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// ── Helpers ───────────────────────────────────────────────────────────────────

function getToday(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Intl.DateTimeFormat("es-AR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(year, month - 1, day));
}

function formatTime(time: string): string {
  return time.slice(0, 5);
}

function getCourtName(courts: TCourt[], courtId: string): string {
  return courts.find((c) => c.id === courtId)?.name ?? "Cancha desconocida";
}

function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function monthKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

function monthLabel(date: Date): string {
  return new Intl.DateTimeFormat("es-AR", {
    month: "long",
    year: "numeric",
  }).format(date);
}

function buildMonthGrid(date: Date): Array<Date | null> {
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  const daysInMonth = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0,
  ).getDate();
  const leadingEmpty = (firstDay.getDay() + 6) % 7;

  const cells: Array<Date | null> = [];
  for (let i = 0; i < leadingEmpty; i += 1) cells.push(null);
  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(new Date(date.getFullYear(), date.getMonth(), day));
  }
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

// ── Status badge ──────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: TBooking["status"] }) {
  if (status === "ACTIVE") {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 shrink-0">
        Activa
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500 shrink-0">
      Cancelada
    </span>
  );
}

// ── Booking row ───────────────────────────────────────────────────────────────

function BookingRow({
  booking,
  courts,
  today,
  onCancelRequest,
  isCancelling,
}: {
  booking: TBooking;
  courts: TCourt[];
  today: string;
  onCancelRequest: (b: TBooking) => void;
  isCancelling: boolean;
}) {
  const courtName = getCourtName(courts, booking.courtId);
  const personLabel = booking.guestName ?? "Usuario registrado";
  const isToday = booking.date === today;

  return (
    <div className="flex items-center gap-3 py-3.5 border-b last:border-0">
      <StatusBadge status={booking.status} />

      <div className="flex-1 min-w-0 grid grid-cols-[1fr_auto] gap-x-4">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">
            {personLabel}
          </p>
          <p className="text-xs text-muted-foreground truncate">
            {courtName} · {formatTime(booking.startTime)} –{" "}
            {formatTime(booking.endTime)}
          </p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-sm font-medium text-foreground">
            {isToday ? "Hoy" : formatDate(booking.date)}
          </p>
          {booking.totalPrice !== undefined && (
            <p className="text-xs text-muted-foreground">
              ${booking.totalPrice.toLocaleString("es-AR")}
            </p>
          )}
        </div>
      </div>

      <div className="shrink-0 w-24 flex justify-end">
        {booking.status === "ACTIVE" && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => onCancelRequest(booking)}
            disabled={isCancelling}
          >
            <Ban className="h-3.5 w-3.5 mr-1" />
            Cancelar
          </Button>
        )}
      </div>
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────

function BookingsDashboard({ businessId }: { businessId: string }) {
  const today = getToday();
  const weekDays = ["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"];

  const [filterCourtId] = useState<string>("all");
  const [filterFrom] = useState<string>("");
  const [filterTo] = useState<string>("");
  const [createOpen, setCreateOpen] = useState<boolean>(false);
  const [newBooking, setNewBooking] = useState({
    courtId: "",
    date: today,
    startTime: "18:00",
    endTime: "19:00",
    guestName: "",
    guestPhone: "",
    guestEmail: "",
    totalPrice: "",
    notes: "",
  });
  const [calendarMonth, setCalendarMonth] = useState<Date>(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [selectedDate, setSelectedDate] = useState<string>(today);
  const [cancelTarget, setCancelTarget] = useState<TBooking | null>(null);

  const courtsQuery = useCourtsByBusinessQuery(businessId);
  const bookingsQuery = useBookingsByBusinessQuery(businessId);
  const cancelMutation = useCancelBookingMutation();
  const createMutation = useCreateBookingMutation();

  const courts = courtsQuery.data ?? [];
  const allBookings = bookingsQuery.data ?? [];

  const filtered = useMemo(
    () =>
      allBookings
        .filter((b) => filterCourtId === "all" || b.courtId === filterCourtId)
        .filter((b) => !filterFrom || b.date >= filterFrom)
        .filter((b) => !filterTo || b.date <= filterTo)
        .sort(
          (a, b) =>
            b.date.localeCompare(a.date) ||
            b.startTime.localeCompare(a.startTime),
        ),
    [allBookings, filterCourtId, filterFrom, filterTo],
  );

  const stats = useMemo(
    () => ({
      active: filtered.filter((b) => b.status === "ACTIVE").length,
      cancelled: filtered.filter((b) => b.status === "CANCELLED").length,
    }),
    [filtered],
  );

  const bookingsByDate = useMemo(() => {
    const map = new Map<string, TBooking[]>();
    filtered.forEach((booking) => {
      const current = map.get(booking.date) ?? [];
      current.push(booking);
      map.set(booking.date, current);
    });
    map.forEach((items, key) => {
      map.set(
        key,
        items.sort((a, b) => a.startTime.localeCompare(b.startTime)),
      );
    });
    return map;
  }, [filtered]);

  const calendarCells = useMemo(
    () => buildMonthGrid(calendarMonth),
    [calendarMonth],
  );
  const selectedDateBookings = bookingsByDate.get(selectedDate) ?? [];
  const calendarBookingsCount = filtered.filter(
    (booking) => booking.date.slice(0, 7) === monthKey(calendarMonth),
  ).length;

  const hasFilters =
    filterCourtId !== "all" || filterFrom !== "" || filterTo !== "";

  function handleCancelConfirm() {
    if (!cancelTarget) return;
    cancelMutation.mutate(
      { businessId, bookingId: cancelTarget.id },
      {
        onSuccess: () => {
          sileo.success({ title: "Reserva cancelada" });
          setCancelTarget(null);
        },
        onError: () => {
          sileo.error({ title: "No se pudo cancelar la reserva" });
        },
      },
    );
  }

  function openCreateDialog() {
    setNewBooking((prev) => ({
      ...prev,
      date: selectedDate || today,
      courtId: prev.courtId || courts[0]?.id || "",
    }));
    setCreateOpen(true);
  }

  function handleCreateBooking() {
    if (!newBooking.courtId || !newBooking.date) {
      sileo.error({ title: "Completá cancha y fecha" });
      return;
    }
    if (!newBooking.startTime || !newBooking.endTime) {
      sileo.error({ title: "Completá horario de inicio y fin" });
      return;
    }
    if (newBooking.startTime >= newBooking.endTime) {
      sileo.error({ title: "La hora de fin debe ser mayor a la de inicio" });
      return;
    }

    createMutation.mutate(
      {
        businessId,
        data: {
          courtId: newBooking.courtId,
          date: newBooking.date,
          startTime: newBooking.startTime,
          guestName: newBooking.guestName.trim() || undefined,
          guestPhone: newBooking.guestPhone.trim() || undefined,
          guestEmail: newBooking.guestEmail.trim() || undefined,
          totalPrice: newBooking.totalPrice
            ? Number(newBooking.totalPrice)
            : undefined,
          notes: newBooking.notes.trim() || undefined,
        },
      },
      {
        onSuccess: () => {
          sileo.success({ title: "Reserva creada" });
          setCreateOpen(false);
          setNewBooking({
            courtId: courts[0]?.id ?? "",
            date: selectedDate || today,
            startTime: "18:00",
            endTime: "19:00",
            guestName: "",
            guestPhone: "",
            guestEmail: "",
            totalPrice: "",
            notes: "",
          });
        },
        onError: () => {
          sileo.error({ title: "No se pudo crear la reserva" });
        },
      },
    );
  }

  function moveMonth(delta: number) {
    setCalendarMonth((prev) => {
      const next = new Date(prev.getFullYear(), prev.getMonth() + delta, 1);
      setSelectedDate(toDateKey(next));
      return next;
    });
  }

  function goToToday() {
    const now = new Date();
    setCalendarMonth(new Date(now.getFullYear(), now.getMonth(), 1));
    setSelectedDate(today);
  }

  return (
    <main className="space-y-5">
      {/* Encabezado */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
            Reservas
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Gestion� las reservas de tu negocio
          </p>
        </div>
        <Button
          className="h-9 text-sm gap-1.5 shrink-0"
          onClick={openCreateDialog}
          disabled={courts.length === 0}
        >
          <Plus className="h-4 w-4" />
          Nueva reserva
        </Button>
      </div>

      {/* Totales */}
      {!bookingsQuery.isLoading && (
        <div className="flex items-center gap-3 text-sm text-muted-foreground px-0.5">
          <span>
            <span className="font-semibold text-foreground">
              {stats.active}
            </span>{" "}
            activas
          </span>
          <span>·</span>
          <span>
            <span className="font-semibold text-foreground">
              {stats.cancelled}
            </span>{" "}
            canceladas
          </span>
          {hasFilters && (
            <>
              <span>·</span>
              <span className="text-xs">({filtered.length} resultados)</span>
            </>
          )}
        </div>
      )}

      {/* Lista de reservas */}
      {bookingsQuery.isLoading ? (
        <Card className="shadow-sm">
          <CardContent className="px-5 py-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-3 py-3.5 border-b last:border-0"
              >
                <div className="h-5 w-16 rounded-full bg-muted animate-pulse shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3.5 w-36 bg-muted rounded animate-pulse" />
                  <div className="h-3 w-28 bg-muted rounded animate-pulse" />
                </div>
                <div className="h-3.5 w-20 bg-muted rounded animate-pulse" />
              </div>
            ))}
          </CardContent>
        </Card>
      ) : bookingsQuery.isError ? (
        <Card className="shadow-sm border-destructive/25 bg-destructive/5">
          <CardHeader>
            <CardTitle className="text-destructive text-sm">
              No se pudieron cargar las reservas
            </CardTitle>
            <CardDescription className="text-destructive/80 text-xs">
              {bookingsQuery.error instanceof Error
                ? bookingsQuery.error.message
                : "Error inesperado."}
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button
              size="sm"
              onClick={() => bookingsQuery.refetch()}
              className="gap-2"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Reintentar
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="space-y-4">
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-base">Calendario</CardTitle>
                  <CardDescription className="text-xs mt-1">
                    {calendarBookingsCount} reservas en{" "}
                    {monthLabel(calendarMonth)}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-1.5">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => moveMonth(-1)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => moveMonth(1)}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-xs"
                    onClick={goToToday}
                  >
                    Hoy
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-5 pb-5 space-y-3">
              <div className="grid grid-cols-7 gap-1">
                {weekDays.map((day) => (
                  <div
                    key={day}
                    className="h-8 flex items-center justify-center text-[11px] font-semibold uppercase tracking-wide text-muted-foreground"
                  >
                    {day}
                  </div>
                ))}
                {calendarCells.map((cell, index) => {
                  if (!cell) {
                    return (
                      <div
                        key={`empty-${index}`}
                        className="h-20 rounded-md border border-transparent"
                      />
                    );
                  }

                  const cellDate = toDateKey(cell);
                  const dayBookings = bookingsByDate.get(cellDate) ?? [];
                  const activeCount = dayBookings.filter(
                    (b) => b.status === "ACTIVE",
                  ).length;
                  const cancelledCount = dayBookings.length - activeCount;
                  const isSelected = cellDate === selectedDate;
                  const isToday = cellDate === today;

                  return (
                    <button
                      key={cellDate}
                      type="button"
                      onClick={() => setSelectedDate(cellDate)}
                      className={[
                        "h-20 rounded-md border p-2 text-left transition-colors",
                        "hover:bg-muted/50",
                        isSelected
                          ? "border-primary bg-primary/5"
                          : "border-border bg-background",
                        isToday ? "ring-1 ring-primary/30" : "",
                      ].join(" ")}
                    >
                      <div className="flex items-start justify-between">
                        <span
                          className={[
                            "text-sm font-semibold",
                            isSelected ? "text-primary" : "text-foreground",
                          ].join(" ")}
                        >
                          {cell.getDate()}
                        </span>
                        {dayBookings.length > 0 && (
                          <span className="text-[10px] font-medium text-muted-foreground">
                            {dayBookings.length}
                          </span>
                        )}
                      </div>
                      {dayBookings.length > 0 ? (
                        <div className="mt-2 space-y-1">
                          <div className="h-1.5 rounded-full bg-primary/20 overflow-hidden">
                            <div
                              className="h-full bg-primary"
                              style={{
                                width: `${(activeCount / dayBookings.length) * 100}%`,
                              }}
                            />
                          </div>
                          <p className="text-[10px] text-muted-foreground leading-none">
                            {activeCount} activas
                            {cancelledCount > 0
                              ? ` - ${cancelledCount} canceladas`
                              : ""}
                          </p>
                        </div>
                      ) : (
                        <p className="mt-2 text-[10px] text-muted-foreground/70 leading-none">
                          Sin reservas
                        </p>
                      )}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">
                Detalle del{" "}
                {selectedDate === today ? "hoy" : formatDate(selectedDate)}
              </CardTitle>
              <CardDescription className="text-xs">
                {selectedDateBookings.length} reservas
              </CardDescription>
            </CardHeader>
            <CardContent className="px-5 py-0">
              {selectedDateBookings.length === 0 ? (
                <div className="py-8 text-center text-xs text-muted-foreground">
                  No hay reservas para esta fecha.
                </div>
              ) : (
                selectedDateBookings.map((booking) => (
                  <BookingRow
                    key={booking.id}
                    booking={booking}
                    courts={courts}
                    today={today}
                    onCancelRequest={setCancelTarget}
                    isCancelling={
                      cancelMutation.isPending &&
                      cancelTarget?.id === booking.id
                    }
                  />
                ))
              )}
            </CardContent>
            <CardFooter className="pt-4">
              <p className="text-xs text-muted-foreground">
                Tip: usa filtros de cancha o rango para acotar el calendario.
              </p>
            </CardFooter>
          </Card>
        </div>
      )}

      <Dialog
        open={createOpen}
        onOpenChange={(open) => {
          if (!createMutation.isPending) setCreateOpen(open);
        }}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Nueva reserva</DialogTitle>
            <DialogDescription>
              Creá una reserva manual para una cancha y horario.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-xs font-medium">Cancha</Label>
              <Select
                value={newBooking.courtId}
                onValueChange={(value) =>
                  setNewBooking((prev) => ({ ...prev, courtId: value }))
                }
              >
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="Seleccionar cancha" />
                </SelectTrigger>
                <SelectContent>
                  {courts.map((court) => (
                    <SelectItem key={court.id} value={court.id}>
                      {court.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Fecha</Label>
              <Input
                type="date"
                value={newBooking.date}
                onChange={(e) =>
                  setNewBooking((prev) => ({ ...prev, date: e.target.value }))
                }
                className="h-9 text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Desde</Label>
                <Input
                  type="time"
                  value={newBooking.startTime}
                  onChange={(e) =>
                    setNewBooking((prev) => ({
                      ...prev,
                      startTime: e.target.value,
                    }))
                  }
                  className="h-9 text-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Cliente</Label>
              <Input
                placeholder="Nombre del cliente"
                value={newBooking.guestName}
                onChange={(e) =>
                  setNewBooking((prev) => ({
                    ...prev,
                    guestName: e.target.value,
                  }))
                }
                className="h-9 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Teléfono</Label>
              <Input
                placeholder="Opcional"
                value={newBooking.guestPhone}
                onChange={(e) =>
                  setNewBooking((prev) => ({
                    ...prev,
                    guestPhone: e.target.value,
                  }))
                }
                className="h-9 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Email</Label>
              <Input
                type="email"
                placeholder="Opcional"
                value={newBooking.guestEmail}
                onChange={(e) =>
                  setNewBooking((prev) => ({
                    ...prev,
                    guestEmail: e.target.value,
                  }))
                }
                className="h-9 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Precio total</Label>
              <Input
                type="number"
                min={0}
                placeholder="Opcional"
                value={newBooking.totalPrice}
                onChange={(e) =>
                  setNewBooking((prev) => ({
                    ...prev,
                    totalPrice: e.target.value,
                  }))
                }
                className="h-9 text-sm"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-xs font-medium">Notas</Label>
              <Input
                placeholder="Opcional"
                value={newBooking.notes}
                onChange={(e) =>
                  setNewBooking((prev) => ({ ...prev, notes: e.target.value }))
                }
                className="h-9 text-sm"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCreateOpen(false)}
              disabled={createMutation.isPending}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleCreateBooking}
              disabled={createMutation.isPending || courts.length === 0}
            >
              {createMutation.isPending ? "Creando..." : "Crear reserva"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo de confirmación de cancelación */}
      <Dialog
        open={!!cancelTarget}
        onOpenChange={(open) => {
          if (!open) setCancelTarget(null);
        }}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>¿Cancelar reserva?</DialogTitle>
            <DialogDescription>
              Esta acción no se puede deshacer. La reserva quedará marcada como
              cancelada.
            </DialogDescription>
          </DialogHeader>
          {cancelTarget && (
            <div className="rounded-lg bg-muted/60 px-4 py-3 space-y-1 text-sm">
              <p className="font-semibold">
                {cancelTarget.guestName ?? "Usuario registrado"}
              </p>
              <p className="text-muted-foreground text-xs">
                {getCourtName(courts, cancelTarget.courtId)} ·{" "}
                {formatDate(cancelTarget.date)} ·{" "}
                {formatTime(cancelTarget.startTime)} –{" "}
                {formatTime(cancelTarget.endTime)}
              </p>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCancelTarget(null)}
              disabled={cancelMutation.isPending}
            >
              Volver
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelConfirm}
              disabled={cancelMutation.isPending}
            >
              {cancelMutation.isPending ? "Cancelando..." : "Sí, cancelar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export function BookingsPage() {
  const businessQuery = useBusinessQuery();

  if (businessQuery.isLoading) {
    return (
      <main className="space-y-5">
        <div className="space-y-1.5">
          <div className="h-7 w-32 bg-muted rounded-md animate-pulse" />
          <div className="h-4 w-52 bg-muted rounded-md animate-pulse" />
        </div>
        <div className="h-36 rounded-xl bg-muted animate-pulse" />
        <div className="h-64 rounded-xl bg-muted animate-pulse" />
      </main>
    );
  }

  const businesses = businessQuery.data ?? [];
  if (businesses.length === 0) return null;

  return <BookingsDashboard businessId={businesses[0].id} />;
}
