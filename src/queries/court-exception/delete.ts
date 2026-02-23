import { ACCESS_TOKEN_KEY } from "@/context/auth.context";
import { CourtExceptionService } from "@/services/court-exception.service";
import { setAuthInterceptor } from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const removeCourtException = async ({
  courtId,
}: {
  courtId: string;
}): Promise<void> => {
  await setAuthInterceptor(localStorage.getItem(ACCESS_TOKEN_KEY));
  await CourtExceptionService.removeCourtException(courtId);
};

export const useRemoveCourtExceptionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeCourtException,
    mutationKey: ["court-exception"],
    onSuccess: (_, { courtId }) => {
      queryClient.invalidateQueries({
        queryKey: ["court", courtId, "exceptions"],
      });
    },
  });
};
