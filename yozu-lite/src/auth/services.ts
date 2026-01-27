import {
  IAuthResponse,
  ILoginRequest,
  IRefreshTokenRequest,
  IRegisterRequest,
  Role,
} from "@yozu/contracts";
import { callAPI } from "./api";
import { Method } from "./constants";
import { getRefreshToken, saveTokens } from "./storage";

export const authService = {
  async register(
    email: string,
    password: string,
    phoneNumber: string,
    role: Role,
  ) {
    const result = await callAPI<IRegisterRequest, IAuthResponse>({
      route: "/users/register",
      method: Method.POST,
      data: { email, password, phoneNumber, role },
      isPublicRoute: true,
    });

    if (!result.ok || !result.data) {
      throw new Error(result.errorMessage);
    }

    saveTokens(result.data);
    return result.data;
  },

  async login(emailOrPhone: string, password: string) {
    const result = await callAPI<ILoginRequest, IAuthResponse>({
      route: "/users/login",
      method: Method.POST,
      data: { emailOrPhone, password },
      isPublicRoute: true,
    });

    if (!result.ok || !result.data) {
      throw new Error(result.errorMessage);
    }

    saveTokens(result.data);
    return result.data;
  },

  async refreshAccessToken(): Promise<IAuthResponse | null> {
    const refreshToken = getRefreshToken();
    if (!refreshToken) return null;

    const result = await callAPI<IRefreshTokenRequest, IAuthResponse>({
      route: `/users/refresh`,
      method: Method.POST,
      data: { refreshToken },
      isPublicRoute: true,
    });

    if (result.ok && result.data) {
      saveTokens(result.data);
      return result.data;
    }

    return null;
  },

  async getOnboardingStatus(role: Role): Promise<boolean> {
    const route =
      role === Role.STUDENT
        ? "/profiles/students/onboarding-status"
        : "/profiles/companies/onboarding-status";

    const result = await callAPI<void, { isCompleted: boolean }>({
      route,
      method: Method.GET,
    });

    return result.ok && result.data ? result.data.isCompleted : false;
  },
};
