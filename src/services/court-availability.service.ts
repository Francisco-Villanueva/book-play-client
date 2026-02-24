import { axiosInstance } from "@/utils/api";
import type { TAvailabilityRule } from "@/models/availability-rule.model";

export class CourtAvailabilityService {
  static async getCourtAvailability(
    businessId: string,
    courtId: string,
  ): Promise<TAvailabilityRule[]> {
    const res = await axiosInstance.get(
      `/businesses/${businessId}/courts/${courtId}/availability-rules`,
    );
    return res.data;
  }

  static async addCourtAvailability(
    businessId: string,
    courtId: string,
    data: { ruleId: string },
  ): Promise<void> {
    await axiosInstance.post(
      `/businesses/${businessId}/courts/${courtId}/availability-rules`,
      data,
    );
  }

  static async removeCourtAvailability(
    businessId: string,
    courtId: string,
    ruleId: string,
  ): Promise<void> {
    await axiosInstance.delete(
      `/businesses/${businessId}/courts/${courtId}/availability-rules/${ruleId}`,
    );
  }
}
