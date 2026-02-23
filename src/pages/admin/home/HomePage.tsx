import { useMemo } from "react";
import { useNavigate } from "react-router";
import {
  Building2,
  CalendarCheck2,
  CheckCircle2,
  ChevronRight,
  Clock3,
  DollarSign,
  Layers,
  Plus,
} from "lucide-react";

import { useBusinessQuery } from "@/queries/business/get";
import { useCourtsByBusinessQuery } from "@/queries/court/get";
import { useBookingsByBusinessQuery } from "@/queries/booking/get";
import type { TBooking } from "@/models/booking.model";
import type { TCourt } from "@/models/court.model";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";

// ── Helpers ───────────────────────────────────────────────────────────────────

function getToday(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function formatTime(time: string) {
  return time.slice(0, 5);
}

function formatShortDate(dateStr: string) {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Intl.DateTimeFormat("es-AR", {
    day: "numeric",
    month: "short",
  }).format(new Date(year, month - 1, day));
}

function getCourtName(courts: TCourt[], courtId: string) {
  return courts.find((c) => c.id === courtId)?.name ?? "Cancha";
}

// ── Stat card ─────────────────────────────────────────────────────────────────

function StatCard({
  icon: Icon,
  label,
  value,
  isLoading,
}: {
  icon: React.ElementType;
  label: string;
  value: number | string;
  isLoading?: boolean;
}) {
  return (
    <Card className="shadow-sm">
      <CardContent className="px-5 pt-5 pb-5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[0.7rem] font-semibold text-muted-foreground uppercase tracking-wider">
              {label}
            </p>
            {isLoading ? (
              <div className="h-7 w-14 bg-muted rounded-md animate-pulse mt-1" />
            ) : (
              <p className="text-2xl font-extrabold text-foreground mt-0.5 leading-none">
                {value}
              </p>
            )}
          </div>
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <Icon className="h-[1.1rem] w-[1.1rem] text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ── Booking row ───────────────────────────────────────────────────────────────

function BookingRow({
  booking,
  courts,
  today,
}: {
  booking: TBooking;
  courts: TCourt[];
  today: string;
}) {
  const isToday = booking.date === today;
  const courtName = getCourtName(courts, booking.courtId);
  const guestLabel = booking.guestName ?? "Usuario registrado";

  return (
    <div className="flex items-center justify-between py-3 border-b last:border-0 gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
          <Clock3 className="h-3.5 w-3.5 text-muted-foreground" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">
            {guestLabel}
          </p>
          <p className="text-xs text-muted-foreground truncate">
            {courtName} · {formatTime(booking.startTime)} –{" "}
            {formatTime(booking.endTime)}
          </p>
        </div>
      </div>
      <div className="flex flex-col items-end gap-0.5 shrink-0">
        <span className="text-xs font-medium text-muted-foreground">
          {isToday ? "Hoy" : formatShortDate(booking.date)}
        </span>
        {booking.totalPrice !== undefined && (
          <span className="text-xs font-semibold text-foreground">
            ${booking.totalPrice.toLocaleString("es-AR")}
          </span>
        )}
      </div>
    </div>
  );
}

// ── Court row ─────────────────────────────────────────────────────────────────

function CourtRow({ court }: { court: TCourt }) {
  return (
    <div className="flex items-center justify-between py-3 border-b last:border-0 gap-3">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-foreground truncate">
          {court.name}
        </p>
        {court.sportType && (
          <p className="text-xs text-muted-foreground">{court.sportType}</p>
        )}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <span
          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
            court.isIndoor
              ? "bg-blue-100 text-blue-700"
              : "bg-amber-100 text-amber-700"
          }`}
        >
          {court.isIndoor ? "Cubierta" : "Aire libre"}
        </span>
        {court.pricePerHour !== undefined && (
          <span className="text-xs font-medium text-muted-foreground">
            ${court.pricePerHour.toLocaleString("es-AR")}/h
          </span>
        )}
      </div>
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────

function Dashboard({
  businessId,
  businessName,
}: {
  businessId: string;
  businessName: string;
}) {
  const navigate = useNavigate();
  const today = getToday();

  const courtsQuery = useCourtsByBusinessQuery(businessId);
  const bookingsQuery = useBookingsByBusinessQuery(businessId);

  const courts = courtsQuery.data ?? [];
  const bookings = bookingsQuery.data ?? [];

  const stats = useMemo(() => {
    const active = bookings.filter((b) => b.status === "ACTIVE");
    const todayBookings = active.filter((b) => b.date === today);
    const todayRevenue = todayBookings.reduce(
      (sum, b) => sum + (b.totalPrice ?? 0),
      0,
    );
    return {
      courts: courts.length,
      todayCount: todayBookings.length,
      activeCount: active.length,
      todayRevenue,
    };
  }, [courts, bookings, today]);

  const upcomingBookings = useMemo(
    () =>
      bookings
        .filter((b) => b.status === "ACTIVE" && b.date >= today)
        .sort(
          (a, b) =>
            a.date.localeCompare(b.date) ||
            a.startTime.localeCompare(b.startTime),
        )
        .slice(0, 8),
    [bookings, today],
  );

  const dataLoading = courtsQuery.isLoading || bookingsQuery.isLoading;

  return (
    <main className="space-y-6">
      {/* Encabezado */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
          {businessName}
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Resumen de tu negocio
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          icon={Layers}
          label="Canchas"
          value={stats.courts}
          isLoading={courtsQuery.isLoading}
        />
        <StatCard
          icon={CalendarCheck2}
          label="Reservas hoy"
          value={stats.todayCount}
          isLoading={bookingsQuery.isLoading}
        />
        <StatCard
          icon={CheckCircle2}
          label="Activas"
          value={stats.activeCount}
          isLoading={bookingsQuery.isLoading}
        />
        <StatCard
          icon={DollarSign}
          label="Ingresos hoy"
          value={`$${stats.todayRevenue.toLocaleString("es-AR")}`}
          isLoading={bookingsQuery.isLoading}
        />
      </div>

      {/* Próximas reservas */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-foreground">
            Próximas reservas
          </h2>
          <Button
            variant="ghost"
            size="sm"
            className="gap-1 text-xs h-8 px-2"
            onClick={() => navigate(`/businesses/${businessId}`)}
          >
            Ver todo
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>

        {bookingsQuery.isLoading ? (
          <Card className="shadow-sm">
            <CardContent className="px-5 py-2 space-y-1">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 py-3 border-b last:border-0"
                >
                  <div className="w-8 h-8 rounded-lg bg-muted animate-pulse shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3.5 w-32 bg-muted rounded animate-pulse" />
                    <div className="h-3 w-24 bg-muted rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ) : upcomingBookings.length === 0 ? (
          <Card className="shadow-sm">
            <CardContent className="px-5 py-6 flex flex-col items-center text-center gap-2">
              <CalendarCheck2 className="h-8 w-8 text-muted-foreground/40" />
              <p className="text-sm font-medium text-foreground">
                Sin reservas próximas
              </p>
              <p className="text-xs text-muted-foreground">
                Las reservas activas aparecerán aquí.
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card className="shadow-sm">
            <CardContent className="px-5 py-0">
              {upcomingBookings.map((booking) => (
                <BookingRow
                  key={booking.id}
                  booking={booking}
                  courts={courts}
                  today={today}
                />
              ))}
            </CardContent>
          </Card>
        )}
      </section>

      {/* Canchas */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-foreground">Canchas</h2>
          <Button
            variant="ghost"
            size="sm"
            className="gap-1 text-xs h-8 px-2"
            onClick={() => navigate(`/businesses/${businessId}`)}
          >
            Administrar
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>

        {courtsQuery.isLoading ? (
          <Card className="shadow-sm">
            <CardContent className="px-5 py-2 space-y-1">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-3 border-b last:border-0"
                >
                  <div className="space-y-1.5">
                    <div className="h-3.5 w-28 bg-muted rounded animate-pulse" />
                    <div className="h-3 w-16 bg-muted rounded animate-pulse" />
                  </div>
                  <div className="h-5 w-16 bg-muted rounded-full animate-pulse" />
                </div>
              ))}
            </CardContent>
          </Card>
        ) : courts.length === 0 ? (
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                Sin canchas registradas
              </CardTitle>
              <CardDescription className="text-xs">
                Agregá la primera cancha desde la sección del negocio.
              </CardDescription>
            </CardHeader>
            <CardFooter className="pt-0 pb-4">
              <Button
                variant="outline"
                size="sm"
                className="gap-2 h-8 text-xs"
                onClick={() => navigate(`/businesses/${businessId}`)}
              >
                <Plus className="h-3.5 w-3.5" />
                Agregar cancha
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <Card className="shadow-sm">
            <CardContent className="px-5 py-0">
              {courts.map((court) => (
                <CourtRow key={court.id} court={court} />
              ))}
            </CardContent>
          </Card>
        )}
      </section>

      {/* Skeleton de carga global (si ambas queries cargan al mismo tiempo) */}
      {dataLoading && courts.length === 0 && bookings.length === 0 && null}
    </main>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export function HomePage() {
  const businessQuery = useBusinessQuery();

  if (businessQuery.isLoading) {
    return (
      <main className="space-y-6">
        <div className="space-y-1.5">
          <div className="h-7 w-48 bg-muted rounded-md animate-pulse" />
          <div className="h-4 w-36 bg-muted rounded-md animate-pulse" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="shadow-sm">
              <CardContent className="px-5 pt-5 pb-5 space-y-2">
                <div className="h-3 w-20 bg-muted rounded animate-pulse" />
                <div className="h-7 w-14 bg-muted rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    );
  }

  const businesses = businessQuery.data ?? [];
  if (businesses.length === 0) return null;

  const business = businesses[0];

  return <Dashboard businessId={business.id} businessName={business.name} />;
}
