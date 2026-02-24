import { ACCESS_TOKEN_KEY } from "@/context/auth.context";
import { CourtAvailabilityService } from "@/services/court-availability.service";
import { setAuthInterceptor } from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const removeCourtAvailability = async ({
  businessId,
  courtId,
  ruleId,
}: {
  businessId: string;
  courtId: string;
  ruleId: string;
}): Promise<void> => {
  await setAuthInterceptor(localStorage.getItem(ACCESS_TOKEN_KEY));
  await CourtAvailabilityService.removeCourtAvailability(businessId, courtId, ruleId);
};

export const useRemoveCourtAvailabilityMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeCourtAvailability,
    mutationKey: ["court-availability"],
    onSuccess: (_, { courtId }) => {
      queryClient.invalidateQueries({ queryKey: ["court", courtId, "availability-rules"] });
    },
  });
};
