import { useState } from "react";
import { useNavigate } from "react-router";

import {
  ArrowLeft,
  Building2,
  CalendarDays,
  Clock3,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Plus,
  RefreshCw,
} from "lucide-react";

import { useBusinessDetailQuery } from "@/queries/business/get";
import { useCourtsByBusinessQuery } from "@/queries/court/get";
import type { TCourt } from "@/models/court.model";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";

import { CreateCourtForm } from "./create/CreateCourtForm";
import { EditCourtForm } from "./edit/EditCourtForm";

interface BusinessDetailProps {
  businessId: string;
}
export function BusinessDetail({ businessId }: BusinessDetailProps) {
  const navigate = useNavigate();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCourt, setEditingCourt] = useState<TCourt | null>(null);

  const businessQuery = useBusinessDetailQuery(businessId!);
  const courtsQuery = useCourtsByBusinessQuery(businessId!);

  if (businessQuery.isLoading) {
    return (
      <main className="space-y-4">
        <div className="h-8 w-48 rounded-md bg-muted animate-pulse" />
        <div className="h-36 rounded-xl bg-muted animate-pulse" />
        <div className="h-48 rounded-xl bg-muted animate-pulse" />
      </main>
    );
  }

  if (businessQuery.isError || !businessQuery.data) {
    return (
      <main>
        <Card className="border-destructive/25 bg-destructive/5 shadow-sm">
          <CardHeader>
            <CardTitle className="text-destructive">
              No se pudo cargar el negocio
            </CardTitle>
            <CardDescription className="text-destructive/80">
              {businessQuery.error instanceof Error
                ? businessQuery.error.message
                : "Ocurrió un error inesperado."}
            </CardDescription>
          </CardHeader>
          <CardFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Button>
            <Button onClick={() => businessQuery.refetch()} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Reintentar
            </Button>
          </CardFooter>
        </Card>
      </main>
    );
  }

  const business = businessQuery.data;
  const courts = courtsQuery.data ?? [];

  function formatDate(value: string) {
    return new Intl.DateTimeFormat("es-AR", { dateStyle: "medium" }).format(
      new Date(value),
    );
  }

  return (
    <main className="space-y-6">
      {/* Encabezado */}
      <div className="flex items-start gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
            {business.name}
          </h1>
          {business.description && (
            <p className="text-sm text-muted-foreground mt-0.5">
              {business.description}
            </p>
          )}
        </div>
      </div>

      {/* Info del negocio */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3 pt-5 px-6">
          <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Información del negocio
          </CardTitle>
        </CardHeader>
        <CardContent className="px-6 pb-6 space-y-3">
          {business.address && (
            <p className="text-sm flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary shrink-0" />
              {business.address}
            </p>
          )}
          {business.phone && (
            <p className="text-sm flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary shrink-0" />
              {business.phone}
            </p>
          )}
          {business.email && (
            <p className="text-sm flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary shrink-0" />
              {business.email}
            </p>
          )}
          <p className="text-sm flex items-center gap-2">
            <Clock3 className="h-4 w-4 text-primary shrink-0" />
            Turnos de {business.slotDuration} min · {business.timezone}
          </p>
          <p className="text-sm flex items-center gap-2 text-muted-foreground">
            <CalendarDays className="h-4 w-4 text-primary shrink-0" />
            Creado el {formatDate(business.createdAt)}
          </p>
        </CardContent>
      </Card>

      {/* Sección canchas */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-foreground">Canchas</h2>
            <p className="text-sm text-muted-foreground">
              {courtsQuery.isLoading
                ? "Cargando..."
                : `${courts.length} cancha${courts.length === 1 ? "" : "s"} registrada${courts.length === 1 ? "" : "s"}`}
            </p>
          </div>
          <Button className="gap-2" onClick={() => setShowCreateForm(true)}>
            <Plus className="h-4 w-4" />
            Nueva cancha
          </Button>
        </div>

        <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
          <DialogContent className="p-0 sm:max-w-4xl" showCloseButton={false}>
            <CreateCourtForm
              businessId={businessId!}
              onClose={() => setShowCreateForm(false)}
            />
          </DialogContent>
        </Dialog>

        <Dialog
          open={!!editingCourt}
          onOpenChange={(open) => {
            if (!open) setEditingCourt(null);
          }}
        >
          <DialogContent className="p-0 sm:max-w-4xl" showCloseButton={false}>
            {editingCourt && (
              <EditCourtForm
                court={editingCourt}
                onClose={() => setEditingCourt(null)}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Lista de canchas */}
        {courtsQuery.isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <Card key={i} className="shadow-sm">
                <CardContent className="p-5 space-y-3">
                  <div className="h-5 w-32 rounded-md bg-muted animate-pulse" />
                  <div className="h-4 w-20 rounded-md bg-muted animate-pulse" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : courts.length === 0 ? (
          <Card className="shadow-sm">
            <CardContent className="px-6 py-8 flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                <Building2 className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <p className="font-semibold text-foreground">
                  Sin canchas registradas
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Agregá la primera cancha para este negocio.
                </p>
              </div>
              <Button
                variant="outline"
                className="gap-2 mt-1"
                onClick={() => setShowCreateForm(true)}
              >
                <Plus className="h-4 w-4" />
                Agregar cancha
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {courts.map((court) => (
              <Card key={court.id} className="shadow-sm">
                <CardHeader className="pb-2 pt-5 px-5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <CardTitle className="text-base font-semibold">
                        {court.name}
                      </CardTitle>
                      {court.sportType && (
                        <CardDescription>{court.sportType}</CardDescription>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="shrink-0 -mt-1 -mr-1 h-8 w-8 text-muted-foreground hover:text-foreground"
                      onClick={() => setEditingCourt(court)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="px-5 pb-5 space-y-2">
                  {court.surface && (
                    <p className="text-sm text-muted-foreground">
                      Superficie: {court.surface}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        court.isIndoor
                          ? "bg-blue-100 text-blue-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {court.isIndoor ? "Cubierta" : "Al aire libre"}
                    </span>
                    {court.hasLighting && (
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-yellow-100 text-yellow-700">
                        Iluminación
                      </span>
                    )}
                  </div>
                  {court.pricePerHour !== undefined && (
                    <p className="text-sm font-semibold text-foreground">
                      ${court.pricePerHour.toLocaleString("es-AR")} / hora
                    </p>
                  )}
                  {court.capacity !== undefined && (
                    <p className="text-xs text-muted-foreground">
                      Capacidad: {court.capacity} jugadores
                    </p>
                  )}
                  {court.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {court.description}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
