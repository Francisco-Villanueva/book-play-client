import { ACCESS_TOKEN_KEY } from "@/context/auth.context";
import type { TCourt, TUpdateCourtInput } from "@/models/court.model";
import { CourtService } from "@/services/court.service";
import { setAuthInterceptor } from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const updateCourt = async ({
  courtId,
  data,
}: {
  courtId: string;
  data: TUpdateCourtInput;
}): Promise<TCourt> => {
  await setAuthInterceptor(localStorage.getItem(ACCESS_TOKEN_KEY));
  return CourtService.updateCourt(courtId, data);
};

export const useUpdateCourtMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateCourt,
    mutationKey: ["court"],
    onSuccess: (_, { courtId }) => {
      queryClient.invalidateQueries({ queryKey: ["court", courtId] });
    },
  });
};
