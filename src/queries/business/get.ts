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

const fetchBusinessDetail = async (businessId: string): Promise<TBusiness> => {
  await setAuthInterceptor(localStorage.getItem(ACCESS_TOKEN_KEY));
  return BusinessService.getBusinessDetails(businessId);
};

export const useBusinessQuery = () => {
  return useQuery({
    queryKey: ["business"],
    queryFn: fetchBusiness,
  });
};

export const useBusinessDetailQuery = (businessId: string) => {
  return useQuery({
    queryKey: ["business", businessId],
    queryFn: () => fetchBusinessDetail(businessId),
    enabled: !!businessId,
  });
};
