import { ACCESS_TOKEN_KEY } from "@/context/auth.context";
import type { TBusinessUser, TUpdateBusinessUserInput } from "@/models/business-user.model";
import { BusinessUserService } from "@/services/business-user.service";
import { setAuthInterceptor } from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const updateBusinessUser = async ({
  businessId,
  userId,
  data,
}: {
  businessId: string;
  userId: string;
  data: TUpdateBusinessUserInput;
}): Promise<TBusinessUser> => {
  await setAuthInterceptor(localStorage.getItem(ACCESS_TOKEN_KEY));
  return BusinessUserService.updateBusinessUser(businessId, userId, data);
};

export const useUpdateBusinessUserMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateBusinessUser,
    mutationKey: ["business-user"],
    onSuccess: (_, { businessId }) => {
      queryClient.invalidateQueries({ queryKey: ["business", businessId, "users"] });
    },
  });
};
