import { axiosInstance } from "@/utils/api";
import type {
  TAvailabilityRule,
  TCreateAvailabilityRuleInput,
  TUpdateAvailabilityRuleInput,
} from "@/models/availability-rule.model";

export class AvailabilityRuleService {
  static async getAvailabilityRules(businessId: string): Promise<TAvailabilityRule[]> {
    const res = await axiosInstance.get(`/businesses/${businessId}/availability-rules`);
    return res.data;
  }

  static async getAvailabilityRuleDetails(ruleId: string): Promise<TAvailabilityRule> {
    const res = await axiosInstance.get(`/availability-rules/${ruleId}`);
    return res.data;
  }

  static async createAvailabilityRule(
    businessId: string,
    data: TCreateAvailabilityRuleInput,
  ): Promise<TAvailabilityRule> {
    const res = await axiosInstance.post(`/businesses/${businessId}/availability-rules`, data);
    return res.data;
  }

  static async updateAvailabilityRule(
    ruleId: string,
    data: TUpdateAvailabilityRuleInput,
  ): Promise<TAvailabilityRule> {
    const res = await axiosInstance.patch(`/availability-rules/${ruleId}`, data);
    return res.data;
  }

  static async deleteAvailabilityRule(ruleId: string): Promise<void> {
    await axiosInstance.delete(`/availability-rules/${ruleId}`);
  }
}
