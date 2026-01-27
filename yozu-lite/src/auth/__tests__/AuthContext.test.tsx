import { renderHook } from "@testing-library/react";
import React from "react";
import { AuthContext, AuthContextType, useAuth } from "../contexts/AuthContext";

describe("useAuth", () => {
  it("should throw error if used outside of AuthProvider", () => {
    // Prevent console.error from cluttering the output
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    expect(() => renderHook(() => useAuth())).toThrow(
      "useAuth must be used within an AuthProvider",
    );

    consoleSpy.mockRestore();
  });

  it("should return context value when used within AuthProvider", () => {
    const mockValue: AuthContextType = {
      isAuthenticated: true,
      role: null,
      isOnboarded: false,
      logout: jest.fn(),
      checkAuthStatus: jest.fn(),
    };

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthContext.Provider value={mockValue}>{children}</AuthContext.Provider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });
    expect(result.current).toEqual(mockValue);
  });
});
