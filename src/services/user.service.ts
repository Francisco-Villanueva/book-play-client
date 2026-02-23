import { axiosInstance } from "@/utils/api";
import type { TUser, TUpdateUserInput } from "@/models/user.model";

export class UserService {
  static async getUsers(): Promise<TUser[]> {
    const res = await axiosInstance.get("/users");
    return res.data;
  }

  static async getUserDetails(userId: string): Promise<TUser> {
    const res = await axiosInstance.get(`/users/${userId}`);
    return res.data;
  }

  static async updateUser(userId: string, data: TUpdateUserInput): Promise<TUser> {
    const res = await axiosInstance.patch(`/users/${userId}`, data);
    return res.data;
  }

  static async deleteUser(userId: string): Promise<void> {
    await axiosInstance.delete(`/users/${userId}`);
  }
}
