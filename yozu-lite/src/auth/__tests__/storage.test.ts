import { IAuthResponse, OnboardingStep, Role } from "@yozu/contracts";
import {
  getAccessToken,
  getRefreshToken,
  saveTokens,
  setAccessToken,
  setRefreshToken,
} from "../storage";

describe("Auth Storage", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it("should set and get access token", () => {
    setAccessToken("access-token");
    expect(localStorage.getItem("accessToken")).toBe("access-token");
    expect(getAccessToken()).toBe("access-token");
  });

  it("should set and get refresh token", () => {
    setRefreshToken("refresh-token");
    expect(localStorage.getItem("refreshToken")).toBe("refresh-token");
    expect(getRefreshToken()).toBe("refresh-token");
  });

  it("should save both tokens using saveTokens", () => {
    const tokens: IAuthResponse = {
      accessToken: "access-123",
      refreshToken: "refresh-123",
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
    saveTokens(tokens);
    expect(getAccessToken()).toBe("access-123");
    expect(getRefreshToken()).toBe("refresh-123");
  });

  it("should only save provided tokens in saveTokens", () => {
    const tokens: IAuthResponse = {
      accessToken: "access-456",
      refreshToken: "",
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
    saveTokens(tokens);
    expect(getAccessToken()).toBe("access-456");
    expect(getRefreshToken()).toBeNull();
  });
});
