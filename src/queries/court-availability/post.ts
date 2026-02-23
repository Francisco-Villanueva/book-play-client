import { ACCESS_TOKEN_KEY } from "@/context/auth.context";
import type { TCourtAvailability, TCreateCourtAvailabilityInput } from "@/models/court-availability.model";
import { CourtAvailabilityService } from "@/services/court-availability.service";
import { setAuthInterceptor } from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const addCourtAvailability = async ({
  courtId,
  data,
}: {
  courtId: string;
  data: TCreateCourtAvailabilityInput;
}): Promise<TCourtAvailability> => {
  await setAuthInterceptor(localStorage.getItem(ACCESS_TOKEN_KEY));
  return CourtAvailabilityService.addCourtAvailability(courtId, data);
};

export const useAddCourtAvailabilityMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addCourtAvailability,
    mutationKey: ["court-availability"],
    onSuccess: (_, { courtId }) => {
      queryClient.invalidateQueries({ queryKey: ["court", courtId, "availability"] });
    },
  });
};
