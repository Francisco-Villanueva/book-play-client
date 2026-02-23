import { ACCESS_TOKEN_KEY } from "@/context/auth.context";
import type { TUser, TUpdateUserInput } from "@/models/user.model";
import { UserService } from "@/services/user.service";
import { setAuthInterceptor } from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const updateUser = async ({
  userId,
  data,
}: {
  userId: string;
  data: TUpdateUserInput;
}): Promise<TUser> => {
  await setAuthInterceptor(localStorage.getItem(ACCESS_TOKEN_KEY));
  return UserService.updateUser(userId, data);
};

export const useUpdateUserMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateUser,
    mutationKey: ["user"],
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["user", userId] });
    },
  });
};
