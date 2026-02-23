import { ACCESS_TOKEN_KEY } from "@/context/auth.context";
import type { TCourtException } from "@/models/court-exception.model";
import { CourtExceptionService } from "@/services/court-exception.service";
import { setAuthInterceptor } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";

const fetchCourtExceptions = async (courtId: string): Promise<TCourtException[]> => {
  await setAuthInterceptor(localStorage.getItem(ACCESS_TOKEN_KEY));
  return CourtExceptionService.getCourtExceptions(courtId);
};

export const useCourtExceptionsQuery = (courtId: string) => {
  return useQuery({
    queryKey: ["court", courtId, "exceptions"],
    queryFn: () => fetchCourtExceptions(courtId),
    enabled: !!courtId,
  });
};
