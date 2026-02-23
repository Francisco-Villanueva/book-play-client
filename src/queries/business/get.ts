import { ACCESS_TOKEN_KEY } from "@/context/auth.context";
import type { TBusiness } from "@/models/business.model";
import { BusinessService } from "@/services/business.service";
import { setAuthInterceptor } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";

const fetchBusiness = async (): Promise<TBusiness[]> => {
  await setAuthInterceptor(localStorage.getItem(ACCESS_TOKEN_KEY));
  const response = await BusinessService.getBusinesses();
  return response;
};
export const useBusinessQuery = () => {
  return useQuery({
    queryKey: ["business"],
    queryFn: fetchBusiness,
  });
};
