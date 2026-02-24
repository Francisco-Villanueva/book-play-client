import { axiosInstance } from "@/utils/api";
import type {
  TExceptionRule,
  TCreateExceptionRuleInput,
  TUpdateExceptionRuleInput,
} from "@/models/exception-rule.model";

export class ExceptionRuleService {
  static async getExceptionRules(
    businessId: string,
  ): Promise<TExceptionRule[]> {
    const res = await axiosInstance.get(
      `/businesses/${businessId}/exception-rules`,
    );
    return res.data;
  }

  static async getExceptionRuleDetails(
    businessId: string,
    ruleId: string,
  ): Promise<TExceptionRule> {
    const res = await axiosInstance.get(
      `/businesses/${businessId}/exception-rules/${ruleId}`,
    );
    return res.data;
  }

  static async createExceptionRule(
    businessId: string,
    data: TCreateExceptionRuleInput,
  ): Promise<TExceptionRule> {
    const res = await axiosInstance.post(
      `/businesses/${businessId}/exception-rules`,
      data,
    );
    return res.data;
  }

  static async updateExceptionRule(
    businessId: string,
    ruleId: string,
    data: TUpdateExceptionRuleInput,
  ): Promise<TExceptionRule> {
    const res = await axiosInstance.put(
      `/businesses/${businessId}/exception-rules/${ruleId}`,
      data,
    );
    return res.data;
  }

  static async deleteExceptionRule(
    businessId: string,
    ruleId: string,
  ): Promise<void> {
    await axiosInstance.delete(
      `/businesses/${businessId}/exception-rules/${ruleId}`,
    );
  }
}
