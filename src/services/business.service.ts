import { axiosInstance } from "@/utils/api";
import type { TBusiness, TCreateBusinessInput } from "@/models/business.model";

export class BusinessService {
  static async getBusinesses(): Promise<TBusiness[]> {
    const res = await axiosInstance.get(`/businesses`);
    return res.data;
  }
  static async getBusinessDetails(businessId: string): Promise<TBusiness> {
    const res = await axiosInstance.get(`/businesses/${businessId}`);
    return res.data;
  }

  static async createBusiness(data: TCreateBusinessInput): Promise<TBusiness> {
    const res = await axiosInstance.post("/businesses", data);
    return res.data;
  }
}
