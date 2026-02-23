import { ACCESS_TOKEN_KEY } from "@/context/auth.context";
import { UserService } from "@/services/user.service";
import { setAuthInterceptor } from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const deleteUser = async (userId: string): Promise<void> => {
  await setAuthInterceptor(localStorage.getItem(ACCESS_TOKEN_KEY));
  await UserService.deleteUser(userId);
};

export const useDeleteUserMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteUser,
    mutationKey: ["user"],
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["user", userId] });
    },
  });
};
