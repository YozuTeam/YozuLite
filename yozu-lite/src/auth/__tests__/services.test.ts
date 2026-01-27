import { IAuthResponse, OnboardingStep, Role } from "@yozu/contracts";
import * as authApi from "../api";
import { authService } from "../services";
import * as storage from "../storage";

jest.mock("../api");
jest.mock("../storage");

describe("Auth Services", () => {
  const mockTokens: IAuthResponse = {
    accessToken: "access",
    refreshToken: "refresh",
    user: {
      id: "1",
      email: "test@test.com",
      role: Role.STUDENT,
      onboardingStep: OnboardingStep.REGISTERED,
      phoneNumber: "123",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    expiresIn: 3600,
    refreshExpiresIn: 86400,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("register", () => {
    it("should call callAPI and saveTokens on success", async () => {
      (authApi.callAPI as jest.Mock).mockResolvedValue({
        ok: true,
        data: mockTokens,
      });

      const result = await authService.register(
        "test@test.com",
        "pass",
        "123",
        Role.STUDENT,
      );

      expect(authApi.callAPI).toHaveBeenCalledWith(
        expect.objectContaining({ route: "/users/register" }),
      );
      expect(storage.saveTokens).toHaveBeenCalledWith(mockTokens);
      expect(result).toEqual(mockTokens);
    });

    it("should throw error if registration fails", async () => {
      (authApi.callAPI as jest.Mock).mockResolvedValue({
        ok: false,
        errorMessage: "Conflict",
      });

      await expect(
        authService.register("test@test.com", "pass", "123", Role.STUDENT),
      ).rejects.toThrow("Conflict");
    });
  });

  describe("login", () => {
    it("should call callAPI and saveTokens on success", async () => {
      (authApi.callAPI as jest.Mock).mockResolvedValue({
        ok: true,
        data: mockTokens,
      });

      const result = await authService.login("test@test.com", "pass");

      expect(authApi.callAPI).toHaveBeenCalledWith(
        expect.objectContaining({ route: "/users/login" }),
      );
      expect(storage.saveTokens).toHaveBeenCalledWith(mockTokens);
      expect(result).toEqual(mockTokens);
    });

    it("should throw error if login fails", async () => {
      (authApi.callAPI as jest.Mock).mockResolvedValue({
        ok: false,
        errorMessage: "Invalid credentials",
      });

      await expect(authService.login("test@test.com", "pass")).rejects.toThrow(
        "Invalid credentials",
      );
    });
  });

  describe("refreshAccessToken", () => {
    it("should refresh token if refreshToken exists", async () => {
      (storage.getRefreshToken as jest.Mock).mockReturnValue("old-refresh");
      (authApi.callAPI as jest.Mock).mockResolvedValue({
        ok: true,
        data: mockTokens,
      });

      const result = await authService.refreshAccessToken();

      expect(authApi.callAPI).toHaveBeenCalledWith(
        expect.objectContaining({ route: "/users/refresh" }),
      );
      expect(storage.saveTokens).toHaveBeenCalledWith(mockTokens);
      expect(result).toEqual(mockTokens);
    });

    it("should return null if no refreshToken", async () => {
      (storage.getRefreshToken as jest.Mock).mockReturnValue(null);
      const result = await authService.refreshAccessToken();
      expect(result).toBeNull();
      expect(authApi.callAPI).not.toHaveBeenCalled();
    });

    it("should return null if refresh API fails", async () => {
      (storage.getRefreshToken as jest.Mock).mockReturnValue("old-refresh");
      (authApi.callAPI as jest.Mock).mockResolvedValue({ ok: false });
      const result = await authService.refreshAccessToken();
      expect(result).toBeNull();
    });
  });

  describe("getOnboardingStatus", () => {
    it("should return true if onboarding is completed for student", async () => {
      (authApi.callAPI as jest.Mock).mockResolvedValue({
        ok: true,
        data: { isCompleted: true },
      });
      const result = await authService.getOnboardingStatus(Role.STUDENT);
      expect(authApi.callAPI).toHaveBeenCalledWith(
        expect.objectContaining({
          route: "/profiles/students/onboarding-status",
        }),
      );
      expect(result).toBe(true);
    });

    it("should return true if onboarding is completed for company", async () => {
      (authApi.callAPI as jest.Mock).mockResolvedValue({
        ok: true,
        data: { isCompleted: true },
      });
      const result = await authService.getOnboardingStatus(Role.COMPANY);
      expect(authApi.callAPI).toHaveBeenCalledWith(
        expect.objectContaining({
          route: "/profiles/companies/onboarding-status",
        }),
      );
      expect(result).toBe(true);
    });

    it("should return false if API fails", async () => {
      (authApi.callAPI as jest.Mock).mockResolvedValue({ ok: false });
      const result = await authService.getOnboardingStatus(Role.STUDENT);
      expect(result).toBe(false);
    });
  });
});
