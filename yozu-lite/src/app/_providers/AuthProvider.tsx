"use client";

import { useState, useEffect, useRef, PropsWithChildren } from "react";
import { useRouter } from "next/navigation";
import {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
} from "@/auth/storage";
import { submitData } from "@/auth/utils";
import { Method } from "@/auth/constants";
import { AccessTokenResponse } from "@/auth/dto/responses/access-token.response";
import { AccessTokenRequest } from "@/auth/dto/requests/access-token.request";
import { isTokenExpired } from "@/auth/utils";
import { LoginRequest } from "@/auth/dto/requests/login.request";
import { LoginResponse } from "@/auth/dto/responses/login.response";
import { RegisterRequest } from "@/auth/dto/requests/register.request";
import { RegisterResponse } from "@/auth/dto/responses/register.response";
import axios from "axios";
import { ApiResult, CallApiProps } from "@/auth/types/api";

function getErrorMessage(status?: number, data?: unknown) {
  let backendMsg: string | undefined;

  if (data && typeof data === "object") {
    const errorData = data as Record<string, unknown>;
    backendMsg =
      typeof errorData.message === "string"
        ? errorData.message
        : typeof errorData.error === "string"
          ? errorData.error
          : typeof errorData.detail === "string"
            ? errorData.detail
            : undefined;
  }

  if (!status) return "Erreur réseau ou serveur indisponible.";

  if (status >= 400 && status < 500) {
    switch (status) {
      case 400:
        return backendMsg || "Requête invalide. Vérifie les champs.";
      case 401:
        return "Tu n’es pas connecté(e) (session expirée).";
      case 403:
        return "Accès refusé.";
      case 404:
        return "Ressource introuvable.";
      case 409:
        return backendMsg || "Conflit : déjà existant.";
      default:
        return backendMsg || `Erreur client (${status}).`;
    }
  }

  return "Erreur serveur. Réessaie plus tard.";
}

export const register = async (
  email: string,
  password: string,
  phoneNumber: string,
  role: string,
) => {
  try {
    console.log("Attempting register...");
    const result = await callAPI<RegisterRequest, RegisterResponse>({
      route: "/users/register",
      method: Method.POST,
      data: {
        email,
        password,
        phoneNumber,
        role,
      },
      isPublicRoute: true,
    });

    if (!result.ok || !result.data) {
      throw new Error(result.errorMessage);
    }
    const data: RegisterResponse = result.data;

    if (data.accessToken) {
      localStorage.setItem("accessToken", data.accessToken);
    }
    if (data.refreshToken) {
      localStorage.setItem("refreshToken", data.refreshToken);
    }
  } catch (error) {
    console.error("Register Error:", error);
    throw error;
  }
};

export const login = async (email: string, password: string) => {
  try {
    console.log("Attempting login...");
    const result = await callAPI<LoginRequest, LoginResponse>({
      route: `/users/login`,
      method: Method.POST,
      data: { emailOrPhone: email, password },
      isPublicRoute: true,
    });

    if (!result.ok || !result.data) {
      throw new Error(result.errorMessage);
    }
    const data: LoginResponse = result.data;

    console.log("Login success:", data);
    if (data.accessToken) {
      localStorage.setItem("accessToken", data.accessToken);
    }
    if (data.refreshToken) {
      localStorage.setItem("refreshToken", data.refreshToken);
    }
  } catch (error) {
    console.error("Login Error:", error);
    throw error;
  }
};

export async function callAPI<T, R>({
  isPublicRoute = false,
  ...props
}: CallApiProps<T>): Promise<ApiResult<R>> {
  try {
    let accessToken;
    if (!isPublicRoute) {
      accessToken = getAccessToken();
    }
    if (!isPublicRoute && !accessToken) {
      throw new Error("No access token available");
    }
    const response = await submitData<T, R>({
      route: props.route,
      method: props.method,
      data: props.data,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return { ok: true, data: response };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const data = error.response?.data;

      const msg = getErrorMessage(status, data);
      console.error(
        `[API ${status}] ${props.method} ${props.route} → ${msg}`,
        data,
      );

      return { ok: false, status, errorMessage: msg };
    }

    console.error("[API] Erreur inattendue", error);
    return { ok: false, errorMessage: "Erreur inattendue." };
  }
}

export default function AuthProvider({ children }: PropsWithChildren) {
  const router = useRouter();
  const effectRan = useRef(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    if (effectRan.current) return;
    effectRan.current = true;

    const accessToken = getAccessToken();
    const refreshToken = getRefreshToken();

    const refreshAccessToken = async () => {
      try {
        const refreshToken = getRefreshToken();
        if (!refreshToken) {
          setIsAuthenticated(false);
          throw new Error("No refresh token available");
        }
        const result = await callAPI<AccessTokenRequest, AccessTokenResponse>({
          route: `/users/refresh`,
          method: Method.POST,
          data: { refreshToken },
          isPublicRoute: true,
        });

        if (!result.ok || !result.data) {
          console.error("Refresh failed:", result.errorMessage);
          setIsAuthenticated(false);
          router.replace("/login");
          return;
        }

        console.log("Refresh success:", result.data);
        if (result.data.accessToken) {
          setAccessToken(result.data.accessToken);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          router.replace("/login");
        }
      } catch (error) {
        console.error("Refresh Error:", error);
        setIsAuthenticated(false);
        router.replace("/login");
      }
    };

    const checkAuth = async () => {
      if (!accessToken && !refreshToken) {
        setIsAuthenticated(false);
        router.replace("/login");
        return;
      }

      if (accessToken && !isTokenExpired(accessToken)) {
        console.log("Access token already exists and is valid");
        setIsAuthenticated(true);
        return;
      }

      if (!refreshToken || isTokenExpired(refreshToken)) {
        console.log("Tokens expired or missing, redirecting to login...");
        setIsAuthenticated(false);
        router.replace("/login");
        return;
      }

      await refreshAccessToken();
    };

    checkAuth();
  }, [router]);
  if (isAuthenticated === null || isAuthenticated === false) {
    return null;
  }
  return <>{children}</>;
}
