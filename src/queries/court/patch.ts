import { ACCESS_TOKEN_KEY } from "@/context/auth.context";
import type { TCourt, TUpdateCourtInput } from "@/models/court.model";
import { CourtService } from "@/services/court.service";
import { setAuthInterceptor } from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const updateCourt = async ({
  courtId,
  businessId,
  data,
}: {
  courtId: string;
  businessId: string;
  data: TUpdateCourtInput;
}): Promise<TCourt> => {
  await setAuthInterceptor(localStorage.getItem(ACCESS_TOKEN_KEY));
  return CourtService.updateCourt(courtId, businessId, data);
};

export const useUpdateCourtMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateCourt,
    mutationKey: ["court"],
    onSuccess: (_, { courtId, businessId }) => {
      queryClient.invalidateQueries({ queryKey: ["court", courtId] });
      queryClient.invalidateQueries({
        queryKey: ["business", businessId, "courts"],
      });
    },
  });
};
