import { ACCESS_TOKEN_KEY } from "@/context/auth.context";
import type { TCourt } from "@/models/court.model";
import { CourtService } from "@/services/court.service";
import { setAuthInterceptor } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";

const fetchCourts = async (businessId: string): Promise<TCourt[]> => {
  await setAuthInterceptor(localStorage.getItem(ACCESS_TOKEN_KEY));
  return CourtService.getCourts(businessId);
};

const fetchCourt = async (courtId: string): Promise<TCourt> => {
  await setAuthInterceptor(localStorage.getItem(ACCESS_TOKEN_KEY));
  return CourtService.getCourtDetails(courtId);
};

export const useCourtsByBusinessQuery = (businessId: string) => {
  return useQuery({
    queryKey: ["business", businessId, "courts"],
    queryFn: () => fetchCourts(businessId),
    enabled: !!businessId,
  });
};

export const useCourtQuery = (courtId: string) => {
  return useQuery({
    queryKey: ["court", courtId],
    queryFn: () => fetchCourt(courtId),
    enabled: !!courtId,
  });
};
