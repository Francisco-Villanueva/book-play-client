import { ACCESS_TOKEN_KEY } from "@/context/auth.context";
import { BusinessService } from "@/services/business.service";
import { setAuthInterceptor } from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const deleteBusiness = async (id: string): Promise<void> => {
  await setAuthInterceptor(localStorage.getItem(ACCESS_TOKEN_KEY));
  await BusinessService.deleteBusiness(id);
};

export const useDeleteBusinessMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteBusiness,
    mutationKey: ["business"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["business"] });
    },
  });
};
