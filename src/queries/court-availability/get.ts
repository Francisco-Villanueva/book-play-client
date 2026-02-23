import { ACCESS_TOKEN_KEY } from "@/context/auth.context";
import type { TCourtAvailability } from "@/models/court-availability.model";
import { CourtAvailabilityService } from "@/services/court-availability.service";
import { setAuthInterceptor } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";

const fetchCourtAvailability = async (courtId: string): Promise<TCourtAvailability[]> => {
  await setAuthInterceptor(localStorage.getItem(ACCESS_TOKEN_KEY));
  return CourtAvailabilityService.getCourtAvailability(courtId);
};

export const useCourtAvailabilityQuery = (courtId: string) => {
  return useQuery({
    queryKey: ["court", courtId, "availability"],
    queryFn: () => fetchCourtAvailability(courtId),
    enabled: !!courtId,
  });
};
