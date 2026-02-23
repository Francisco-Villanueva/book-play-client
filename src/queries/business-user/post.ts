import { ACCESS_TOKEN_KEY } from "@/context/auth.context";
import type { TBusinessUser, TCreateBusinessUserInput } from "@/models/business-user.model";
import { BusinessUserService } from "@/services/business-user.service";
import { setAuthInterceptor } from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const addBusinessUser = async ({
  businessId,
  data,
}: {
  businessId: string;
  data: TCreateBusinessUserInput;
}): Promise<TBusinessUser> => {
  await setAuthInterceptor(localStorage.getItem(ACCESS_TOKEN_KEY));
  return BusinessUserService.addBusinessUser(businessId, data);
};

export const useAddBusinessUserMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addBusinessUser,
    mutationKey: ["business-user"],
    onSuccess: (_, { businessId }) => {
      queryClient.invalidateQueries({ queryKey: ["business", businessId, "users"] });
    },
  });
};
