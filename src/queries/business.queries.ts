import { ACCESS_TOKEN_KEY } from "@/context/auth.context";
import type { TBusiness, TCreateBusinessInput } from "@/models/business.model";
import { BusinessService } from "@/services/business.service";
import { setAuthInterceptor } from "@/utils/api";
import { useMutation } from "@tanstack/react-query";

const createBusiness = async (
  data: TCreateBusinessInput,
): Promise<TBusiness> => {
  await setAuthInterceptor(localStorage.getItem(ACCESS_TOKEN_KEY));
  const response = await BusinessService.createBusiness(data);
  return response;
};
export const createBusinessMutation = useMutation({
  mutationFn: createBusiness,
});
