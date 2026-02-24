import { ACCESS_TOKEN_KEY } from "@/context/auth.context";
import { ExceptionRuleService } from "@/services/exception-rule.service";
import { setAuthInterceptor } from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const deleteExceptionRule = async ({
  ruleId,
  businessId,
}: {
  businessId: string;
  ruleId: string;
}): Promise<void> => {
  await setAuthInterceptor(localStorage.getItem(ACCESS_TOKEN_KEY));
  await ExceptionRuleService.deleteExceptionRule(businessId, ruleId);
};

export const useDeleteExceptionRuleMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteExceptionRule,
    mutationKey: ["exception-rule"],
    onSuccess: (_, { ruleId }) => {
      queryClient.invalidateQueries({ queryKey: ["exception-rule", ruleId] });
    },
  });
};
