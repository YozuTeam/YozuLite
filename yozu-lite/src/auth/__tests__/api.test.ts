import axios from "axios";
import { api } from "../api";
import { Method } from "../constants";
import * as storage from "../storage";
import * as utils from "../utils";

jest.mock("../storage");
jest.mock("../utils");
jest.mock("axios");

describe("Auth API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("api.callAPI", () => {
    it("should call submitData with token for private route", async () => {
      (storage.getAccessToken as jest.Mock).mockReturnValue("fake-token");
      (utils.submitData as jest.Mock).mockResolvedValue({ some: "data" });

      const result = await api.callAPI({
        route: "/private",
        method: Method.GET,
      });

      expect(storage.getAccessToken).toHaveBeenCalled();
      expect(utils.submitData).toHaveBeenCalledWith(
        expect.objectContaining({
          headers: { Authorization: "Bearer fake-token" },
        }),
      );
      expect(result).toEqual({ ok: true, data: { some: "data" } });
    });

    it("should call submitData WITHOUT token for public route", async () => {
      (utils.submitData as jest.Mock).mockResolvedValue({ public: "data" });

      const result = await api.callAPI({
        route: "/public",
        method: Method.POST,
        isPublicRoute: true,
      });

      expect(storage.getAccessToken).not.toHaveBeenCalled();
      expect(result).toEqual({ ok: true, data: { public: "data" } });
    });

    it("should return error if no token is available for private route", async () => {
      (storage.getAccessToken as jest.Mock).mockReturnValue(null);

      const result = await api.callAPI({
        route: "/private",
        method: Method.GET,
      });

      expect(result.ok).toBe(false);
      expect(result.errorMessage).toBe("Erreur inattendue.");
    });

    it("should handle axios errors (401 Unauthorized)", async () => {
      const axiosError = {
        isAxiosError: true,
        response: {
          status: 401,
          data: { message: "Unauthorized" },
        },
      };

      (storage.getAccessToken as jest.Mock).mockReturnValue("token");
      (utils.submitData as jest.Mock).mockRejectedValue(axiosError);
      (axios.isAxiosError as unknown as jest.Mock).mockReturnValue(true);

      const result = await api.callAPI({
        route: "/error",
        method: Method.GET,
      });

      expect(result.ok).toBe(false);
      expect(result.status).toBe(401);
      expect(result.errorMessage).toBe(
        "Tu n’es pas connecté(e) (session expirée).",
      );
    });

    it("should handle axios errors (400 Bad Request)", async () => {
      const axiosError = {
        isAxiosError: true,
        response: {
          status: 400,
          data: { message: "Custom Error Msg" },
        },
      };

      (storage.getAccessToken as jest.Mock).mockReturnValue("token");
      (utils.submitData as jest.Mock).mockRejectedValue(axiosError);
      (axios.isAxiosError as unknown as jest.Mock).mockReturnValue(true);

      const result = await api.callAPI({
        route: "/error",
        method: Method.GET,
      });

      expect(result.ok).toBe(false);
      expect(result.errorMessage).toBe("Custom Error Msg");
    });

    it("should handle unknown server errors (500)", async () => {
      const axiosError = {
        isAxiosError: true,
        response: {
          status: 500,
        },
      };

      (storage.getAccessToken as jest.Mock).mockReturnValue("token");
      (utils.submitData as jest.Mock).mockRejectedValue(axiosError);
      (axios.isAxiosError as unknown as jest.Mock).mockReturnValue(true);

      const result = await api.callAPI({
        route: "/fail",
        method: Method.GET,
      });

      expect(result.ok).toBe(false);
      expect(result.errorMessage).toBe("Erreur serveur. Réessaie plus tard.");
    });

    it("should handle conflict errors (409)", async () => {
      const axiosError = {
        isAxiosError: true,
        response: {
          status: 409,
          data: { error: "Already exists" },
        },
      };

      (storage.getAccessToken as jest.Mock).mockReturnValue("token");
      (utils.submitData as jest.Mock).mockRejectedValue(axiosError);
      (axios.isAxiosError as unknown as jest.Mock).mockReturnValue(true);

      const result = await api.callAPI({
        route: "/error",
        method: Method.POST,
      });

      expect(result.ok).toBe(false);
      expect(result.errorMessage).toBe("Already exists");
    });

    it("should handle Forbidden errors (403)", async () => {
      const axiosError = {
        isAxiosError: true,
        response: {
          status: 403,
        },
      };

      (storage.getAccessToken as jest.Mock).mockReturnValue("token");
      (utils.submitData as jest.Mock).mockRejectedValue(axiosError);
      (axios.isAxiosError as unknown as jest.Mock).mockReturnValue(true);

      const result = await api.callAPI({
        route: "/forbidden",
        method: Method.GET,
      });

      expect(result.ok).toBe(false);
      expect(result.errorMessage).toBe("Accès refusé.");
    });

    it("should handle Not Found errors (404)", async () => {
      const axiosError = {
        isAxiosError: true,
        response: {
          status: 404,
        },
      };

      (storage.getAccessToken as jest.Mock).mockReturnValue("token");
      (utils.submitData as jest.Mock).mockRejectedValue(axiosError);
      (axios.isAxiosError as unknown as jest.Mock).mockReturnValue(true);

      const result = await api.callAPI({
        route: "/notfound",
        method: Method.GET,
      });

      expect(result.ok).toBe(false);
      expect(result.errorMessage).toBe("Ressource introuvable.");
    });

    it("should handle default client errors (418)", async () => {
      const axiosError = {
        isAxiosError: true,
        response: {
          status: 418,
        },
      };

      (storage.getAccessToken as jest.Mock).mockReturnValue("token");
      (utils.submitData as jest.Mock).mockRejectedValue(axiosError);
      (axios.isAxiosError as unknown as jest.Mock).mockReturnValue(true);

      const result = await api.callAPI({
        route: "/teapot",
        method: Method.GET,
      });

      expect(result.ok).toBe(false);
      expect(result.errorMessage).toBe("Erreur client (418).");
    });

    it("should extract error from 'data.detail'", async () => {
      const axiosError = {
        isAxiosError: true,
        response: {
          status: 400,
          data: { detail: "Detailed error message" },
        },
      };

      (storage.getAccessToken as jest.Mock).mockReturnValue("token");
      (utils.submitData as jest.Mock).mockRejectedValue(axiosError);
      (axios.isAxiosError as unknown as jest.Mock).mockReturnValue(true);

      const result = await api.callAPI({
        route: "/detail",
        method: Method.POST,
      });

      expect(result.errorMessage).toBe("Detailed error message");
    });

    it("should handle network errors (no status)", async () => {
      const axiosError = {
        isAxiosError: true,
        response: undefined,
      };

      (storage.getAccessToken as jest.Mock).mockReturnValue("token");
      (utils.submitData as jest.Mock).mockRejectedValue(axiosError);
      (axios.isAxiosError as unknown as jest.Mock).mockReturnValue(true);

      const result = await api.callAPI({
        route: "/error",
        method: Method.GET,
      });

      expect(result.ok).toBe(false);
      expect(result.errorMessage).toBe(
        "Erreur réseau ou serveur indisponible.",
      );
    });

    it("should handle unhandled/unexpected exceptions", async () => {
      (storage.getAccessToken as jest.Mock).mockReturnValue("token");
      (utils.submitData as jest.Mock).mockRejectedValue(
        new Error("Unexpected"),
      );
      (axios.isAxiosError as unknown as jest.Mock).mockReturnValue(false);

      const result = await api.callAPI({
        route: "/fatal",
        method: Method.GET,
      });

      expect(result.ok).toBe(false);
      expect(result.errorMessage).toBe("Erreur inattendue.");
    });
  });
});
