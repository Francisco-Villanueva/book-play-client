import { axiosInstance } from "@/utils/api";
import type {
  TBusinessUser,
  TCreateBusinessUserInput,
  TUpdateBusinessUserInput,
} from "@/models/business-user.model";

export class BusinessUserService {
  static async getBusinessUsers(businessId: string): Promise<TBusinessUser[]> {
    const res = await axiosInstance.get(`/businesses/${businessId}/users`);
    return res.data;
  }

  static async addBusinessUser(
    businessId: string,
    data: TCreateBusinessUserInput,
  ): Promise<TBusinessUser> {
    const res = await axiosInstance.post(`/businesses/${businessId}/users`, data);
    return res.data;
  }

  static async updateBusinessUser(
    businessId: string,
    userId: string,
    data: TUpdateBusinessUserInput,
  ): Promise<TBusinessUser> {
    const res = await axiosInstance.patch(`/businesses/${businessId}/users/${userId}`, data);
    return res.data;
  }

  static async removeBusinessUser(businessId: string, userId: string): Promise<void> {
    await axiosInstance.delete(`/businesses/${businessId}/users/${userId}`);
  }
}
