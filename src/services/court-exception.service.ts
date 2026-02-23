import { axiosInstance } from "@/utils/api";
import type {
  TCourtException,
  TCreateCourtExceptionInput,
} from "@/models/court-exception.model";

export class CourtExceptionService {
  static async getCourtExceptions(courtId: string): Promise<TCourtException[]> {
    const res = await axiosInstance.get(`/courts/${courtId}/exception-rules`);
    return res.data;
  }

  static async addCourtException(
    courtId: string,
    data: TCreateCourtExceptionInput,
  ): Promise<TCourtException> {
    const res = await axiosInstance.post(`/courts/${courtId}/exception-rules`, data);
    return res.data;
  }

  static async removeCourtException(id: string): Promise<void> {
    await axiosInstance.delete(`/court-exceptions/${id}`);
  }
}
