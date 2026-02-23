import { ACCESS_TOKEN_KEY } from "@/context/auth.context";
import type { TCourt, TCreateCourtInput } from "@/models/court.model";
import { CourtService } from "@/services/court.service";
import { setAuthInterceptor } from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const createCourt = async ({
  businessId,
  data,
}: {
  businessId: string;
  data: TCreateCourtInput;
}): Promise<TCourt> => {
  await setAuthInterceptor(localStorage.getItem(ACCESS_TOKEN_KEY));
  return CourtService.createCourt(businessId, data);
};

export const useCreateCourtMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCourt,
    mutationKey: ["court"],
    onSuccess: (_, { businessId }) => {
      queryClient.invalidateQueries({ queryKey: ["business", businessId, "courts"] });
    },
  });
};
