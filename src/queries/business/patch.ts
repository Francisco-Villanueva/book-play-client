import { ACCESS_TOKEN_KEY } from "@/context/auth.context";
import type { TBusiness, TUpdateBusinessInput } from "@/models/business.model";
import { BusinessService } from "@/services/business.service";
import { setAuthInterceptor } from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const updateBusiness = async ({
  id,
  data,
}: {
  id: string;
  data: TUpdateBusinessInput;
}): Promise<TBusiness> => {
  await setAuthInterceptor(localStorage.getItem(ACCESS_TOKEN_KEY));
  return BusinessService.updateBusiness(id, data);
};

export const useUpdateBusinessMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateBusiness,
    mutationKey: ["business"],
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["business"] });
      queryClient.invalidateQueries({ queryKey: ["business", id] });
    },
  });
};
