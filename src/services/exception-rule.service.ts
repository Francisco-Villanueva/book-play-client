import { axiosInstance } from "@/utils/api";
import type {
  TExceptionRule,
  TCreateExceptionRuleInput,
  TUpdateExceptionRuleInput,
} from "@/models/exception-rule.model";

export class ExceptionRuleService {
  static async getExceptionRules(businessId: string): Promise<TExceptionRule[]> {
    const res = await axiosInstance.get(`/businesses/${businessId}/exception-rules`);
    return res.data;
  }

  static async getExceptionRuleDetails(ruleId: string): Promise<TExceptionRule> {
    const res = await axiosInstance.get(`/exception-rules/${ruleId}`);
    return res.data;
  }

  static async createExceptionRule(
    businessId: string,
    data: TCreateExceptionRuleInput,
  ): Promise<TExceptionRule> {
    const res = await axiosInstance.post(`/businesses/${businessId}/exception-rules`, data);
    return res.data;
  }

  static async updateExceptionRule(
    ruleId: string,
    data: TUpdateExceptionRuleInput,
  ): Promise<TExceptionRule> {
    const res = await axiosInstance.patch(`/exception-rules/${ruleId}`, data);
    return res.data;
  }

  static async deleteExceptionRule(ruleId: string): Promise<void> {
    await axiosInstance.delete(`/exception-rules/${ruleId}`);
  }
}
