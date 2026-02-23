import { axiosInstance } from "@/utils/api";
import type {
  TLoginRequest,
  TLoginResponse,
  TRegisterRequest,
  TRegisterResponse,
} from "@/models/auth.model";
import type { TUser } from "@/models/user.model";

export class AuthService {
  static async register(data: TRegisterRequest): Promise<TRegisterResponse> {
    const res = await axiosInstance.post("/auth/register", data);
    return res.data;
  }

  static async login(data: TLoginRequest): Promise<TLoginResponse> {
    const res = await axiosInstance.post("/auth/login", data);
    return res.data;
  }

  static async me(): Promise<TUser> {
    const res = await axiosInstance.get("/auth/me");
    return res.data;
  }
}
