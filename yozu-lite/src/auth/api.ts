import axios from "axios";
import { getAccessToken } from "./storage";
import { ApiResult, CallApiProps } from "./types/types";
import { submitData } from "./utils";

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

export const api = {
  async callAPI<T, R>({
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
  },
};

export async function callAPI<T, R>(
  props: CallApiProps<T>,
): Promise<ApiResult<R>> {
  return api.callAPI<T, R>(props);
}
