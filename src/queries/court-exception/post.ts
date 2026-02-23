import { ACCESS_TOKEN_KEY } from "@/context/auth.context";
import type { TCourtException, TCreateCourtExceptionInput } from "@/models/court-exception.model";
import { CourtExceptionService } from "@/services/court-exception.service";
import { setAuthInterceptor } from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const addCourtException = async ({
  courtId,
  data,
}: {
  courtId: string;
  data: TCreateCourtExceptionInput;
}): Promise<TCourtException> => {
  await setAuthInterceptor(localStorage.getItem(ACCESS_TOKEN_KEY));
  return CourtExceptionService.addCourtException(courtId, data);
};

export const useAddCourtExceptionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addCourtException,
    mutationKey: ["court-exception"],
    onSuccess: (_, { courtId }) => {
      queryClient.invalidateQueries({ queryKey: ["court", courtId, "exceptions"] });
    },
  });
};
