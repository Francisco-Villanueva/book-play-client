import { ACCESS_TOKEN_KEY } from "@/context/auth.context";
import type { TBusinessUser } from "@/models/business-user.model";
import { BusinessUserService } from "@/services/business-user.service";
import { setAuthInterceptor } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";

const fetchBusinessUsers = async (businessId: string): Promise<TBusinessUser[]> => {
  await setAuthInterceptor(localStorage.getItem(ACCESS_TOKEN_KEY));
  return BusinessUserService.getBusinessUsers(businessId);
};

export const useBusinessUsersQuery = (businessId: string) => {
  return useQuery({
    queryKey: ["business", businessId, "users"],
    queryFn: () => fetchBusinessUsers(businessId),
    enabled: !!businessId,
  });
};
