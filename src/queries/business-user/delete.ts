import { ACCESS_TOKEN_KEY } from "@/context/auth.context";
import { BusinessUserService } from "@/services/business-user.service";
import { setAuthInterceptor } from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const removeBusinessUser = async ({
  businessId,
  userId,
}: {
  businessId: string;
  userId: string;
}): Promise<void> => {
  await setAuthInterceptor(localStorage.getItem(ACCESS_TOKEN_KEY));
  await BusinessUserService.removeBusinessUser(businessId, userId);
};

export const useRemoveBusinessUserMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeBusinessUser,
    mutationKey: ["business-user"],
    onSuccess: (_, { businessId }) => {
      queryClient.invalidateQueries({ queryKey: ["business", businessId, "users"] });
    },
  });
};
