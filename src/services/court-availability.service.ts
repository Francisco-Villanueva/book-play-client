import { axiosInstance } from "@/utils/api";
import type {
  TCourtAvailability,
  TCreateCourtAvailabilityInput,
} from "@/models/court-availability.model";

export class CourtAvailabilityService {
  static async getCourtAvailability(courtId: string): Promise<TCourtAvailability[]> {
    const res = await axiosInstance.get(`/courts/${courtId}/availability-rules`);
    return res.data;
  }

  static async addCourtAvailability(
    courtId: string,
    data: TCreateCourtAvailabilityInput,
  ): Promise<TCourtAvailability> {
    const res = await axiosInstance.post(`/courts/${courtId}/availability-rules`, data);
    return res.data;
  }

  static async removeCourtAvailability(id: string): Promise<void> {
    await axiosInstance.delete(`/court-availability/${id}`);
  }
}
