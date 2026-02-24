import { useBusinessQuery } from "@/queries/business/get";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Building2,
  CalendarDays,
  Clock3,
  Mail,
  MapPin,
  Phone,
  Plus,
  RefreshCw,
} from "lucide-react";
import { Navigate, useNavigate } from "react-router";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-AR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function BusinessPage() {
  const businessQuery = useBusinessQuery();
  const navigate = useNavigate();

  if (businessQuery.isLoading) {
    return (
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-4">
        <div className="space-y-2">
          <div className="h-8 w-56 rounded-md bg-muted animate-pulse" />
          <div className="h-4 w-80 rounded-md bg-muted animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="shadow-sm">
              <CardHeader className="space-y-2">
                <div className="h-5 w-40 rounded-md bg-muted animate-pulse" />
                <div className="h-4 w-60 rounded-md bg-muted animate-pulse" />
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="h-4 w-full rounded-md bg-muted animate-pulse" />
                <div className="h-4 w-3/4 rounded-md bg-muted animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    );
  }

  if (businessQuery.isError) {
    return (
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <Card className="border-destructive/25 bg-destructive/5 shadow-sm">
          <CardHeader>
            <CardTitle className="text-destructive">
              No pudimos cargar tus negocios
            </CardTitle>
            <CardDescription className="text-destructive/80">
              {businessQuery.error instanceof Error
                ? businessQuery.error.message
                : "Ocurrió un error inesperado."}
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => businessQuery.refetch()} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Reintentar
            </Button>
          </CardFooter>
        </Card>
      </main>
    );
  }

  const businesses = businessQuery.data ?? [];

  if (businesses.length === 0) {
    return (
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              Aún no tenés negocios creados
            </CardTitle>
            <CardDescription>
              Creá tu primer negocio para empezar a configurar canchas, horarios
              y reservas.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button
              className="gap-2"
              onClick={() => navigate("/admin/businesses/new")}
            >
              <Plus className="h-4 w-4" />
              Crear negocio
            </Button>
          </CardFooter>
        </Card>
      </main>
    );
  }
  if (businesses.length === 1) {
    return <Navigate to={`/admin/businesses/${businesses[0].id}`} />;
  }

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
            Mis negocios
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {businesses.length} negocio{businesses.length === 1 ? "" : "s"}{" "}
            disponible{businesses.length === 1 ? "" : "s"} para administrar.
          </p>
        </div>
        <Button className="gap-2" onClick={() => navigate("/admin/businesses/new")}>
          <Plus className="h-4 w-4" />
          Nuevo negocio
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {businesses.map((business) => (
          <Card
            key={business.id}
            className="shadow-sm cursor-pointer hover:border-primary/40 transition-colors"
            onClick={() => navigate(`/admin/businesses/${business.id}`)}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-lg leading-tight">
                {business.name}
              </CardTitle>
              <CardDescription className="line-clamp-2">
                {business.description?.trim() ||
                  "Sin descripción registrada para este negocio."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {business.address && (
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  {business.address}
                </p>
              )}
              {business.phone && (
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary" />
                  {business.phone}
                </p>
              )}
              {business.email && (
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary" />
                  {business.email}
                </p>
              )}
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Clock3 className="h-4 w-4 text-primary" />
                Turnos de {business.slotDuration} minutos
              </p>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-primary" />
                Creado el {formatDate(business.createdAt)}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
