import { ACCESS_TOKEN_KEY } from "@/context/auth.context";
import type { TUser } from "@/models/user.model";
import { UserService } from "@/services/user.service";
import { setAuthInterceptor } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";

const fetchUsers = async (): Promise<TUser[]> => {
  await setAuthInterceptor(localStorage.getItem(ACCESS_TOKEN_KEY));
  return UserService.getUsers();
};

const fetchUser = async (userId: string): Promise<TUser> => {
  await setAuthInterceptor(localStorage.getItem(ACCESS_TOKEN_KEY));
  return UserService.getUserDetails(userId);
};

export const useUsersQuery = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: fetchUsers,
  });
};

export const useUserQuery = (userId: string) => {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: () => fetchUser(userId),
    enabled: !!userId,
  });
};
