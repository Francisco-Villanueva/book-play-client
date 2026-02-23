import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useBusinessQuery } from "@/queries/business/get";
import { useCourtsByBusinessQuery } from "@/queries/court/get";

export function HomePage() {
  const businessQuery = useBusinessQuery();
  const courtsQuery = useCourtsByBusinessQuery(
    businessQuery.data?.[0]?.id || "",
  );
  return (
    <div className="p-8 flex">
      <Card>
        <CardHeader>
          <CardTitle>Canchas</CardTitle>
          <CardDescription>Estas son las canchas de tu negocio</CardDescription>
        </CardHeader>
        <CardContent>
          {courtsQuery.data?.length === 0 ? (
            <div>No hay canchas registradas</div>
          ) : (
            courtsQuery.data?.map((court) => (
              <div key={court.id}>{court.name}</div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
