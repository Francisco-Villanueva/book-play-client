import { ACCESS_TOKEN_KEY } from "@/context/auth.context";
import { CourtService } from "@/services/court.service";
import { setAuthInterceptor } from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const deleteCourt = async ({ courtId }: { courtId: string }): Promise<void> => {
  await setAuthInterceptor(localStorage.getItem(ACCESS_TOKEN_KEY));
  await CourtService.deleteCourt(courtId);
};

export const useDeleteCourtMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCourt,
    mutationKey: ["court"],
    onSuccess: (_, { courtId }) => {
      queryClient.invalidateQueries({ queryKey: ["court", courtId] });
    },
  });
};
