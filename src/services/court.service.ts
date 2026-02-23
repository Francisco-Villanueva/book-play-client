import { axiosInstance } from "@/utils/api";
import type { TCourt, TCreateCourtInput, TUpdateCourtInput } from "@/models/court.model";

export class CourtService {
  static async getCourts(businessId: string): Promise<TCourt[]> {
    const res = await axiosInstance.get(`/businesses/${businessId}/courts`);
    return res.data;
  }

  static async getCourtDetails(courtId: string): Promise<TCourt> {
    const res = await axiosInstance.get(`/courts/${courtId}`);
    return res.data;
  }

  static async createCourt(businessId: string, data: TCreateCourtInput): Promise<TCourt> {
    const res = await axiosInstance.post(`/businesses/${businessId}/courts`, data);
    return res.data;
  }

  static async updateCourt(courtId: string, data: TUpdateCourtInput): Promise<TCourt> {
    const res = await axiosInstance.patch(`/courts/${courtId}`, data);
    return res.data;
  }

  static async deleteCourt(courtId: string): Promise<void> {
    await axiosInstance.delete(`/courts/${courtId}`);
  }
}
