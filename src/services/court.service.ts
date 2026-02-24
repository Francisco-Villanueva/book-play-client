import { axiosInstance } from "@/utils/api";
import type {
  TCourt,
  TCreateCourtInput,
  TUpdateCourtInput,
} from "@/models/court.model";

export class CourtService {
  static async getCourts(businessId: string): Promise<TCourt[]> {
    const res = await axiosInstance.get(`/businesses/${businessId}/courts`);
    return res.data;
  }

  static async getCourtDetails(
    businessId: string,
    courtId: string,
  ): Promise<TCourt> {
    const res = await axiosInstance.get(
      `/businesses/${businessId}/courts/${courtId}`,
    );
    return res.data;
  }

  static async createCourt(
    businessId: string,
    data: TCreateCourtInput,
  ): Promise<TCourt> {
    const res = await axiosInstance.post(
      `/businesses/${businessId}/courts`,
      data,
    );
    return res.data;
  }

  static async updateCourt(
    businessId: string,
    courtId: string,
    data: TUpdateCourtInput,
  ): Promise<TCourt> {
    const res = await axiosInstance.patch(
      `/businesses/${businessId}/courts/${courtId}`,
      data,
    );
    return res.data;
  }

  static async deleteCourt(businessId: string, courtId: string): Promise<void> {
    await axiosInstance.delete(`/businesses/${businessId}/courts/${courtId}`);
  }
}
