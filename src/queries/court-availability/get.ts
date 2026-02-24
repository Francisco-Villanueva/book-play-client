import { ACCESS_TOKEN_KEY } from "@/context/auth.context";
import type { TAvailabilityRule } from "@/models/availability-rule.model";
import { CourtAvailabilityService } from "@/services/court-availability.service";
import { setAuthInterceptor } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";

const fetchCourtAvailability = async (
  businessId: string,
  courtId: string,
): Promise<TAvailabilityRule[]> => {
  await setAuthInterceptor(localStorage.getItem(ACCESS_TOKEN_KEY));
  return CourtAvailabilityService.getCourtAvailability(businessId, courtId);
};

export const useCourtAvailabilityQuery = (
  businessId: string,
  courtId: string,
) => {
  return useQuery({
    queryKey: ["court", courtId, "availability-rules"],
    queryFn: () => fetchCourtAvailability(businessId, courtId),
    enabled: !!businessId && !!courtId,
  });
};
