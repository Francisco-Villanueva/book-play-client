import { ACCESS_TOKEN_KEY } from "@/context/auth.context";
import { CourtAvailabilityService } from "@/services/court-availability.service";
import { setAuthInterceptor } from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const addCourtAvailability = async ({
  businessId,
  courtId,
  data,
}: {
  businessId: string;
  courtId: string;
  data: { ruleId: string };
}): Promise<void> => {
  await setAuthInterceptor(localStorage.getItem(ACCESS_TOKEN_KEY));
  await CourtAvailabilityService.addCourtAvailability(businessId, courtId, data);
};

export const useAddCourtAvailabilityMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addCourtAvailability,
    mutationKey: ["court-availability"],
    onSuccess: (_, { courtId }) => {
      queryClient.invalidateQueries({ queryKey: ["court", courtId, "availability-rules"] });
    },
  });
};
