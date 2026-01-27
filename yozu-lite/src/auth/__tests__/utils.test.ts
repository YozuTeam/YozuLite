import axios from "axios";
import { Method } from "../constants";
import { isTokenExpired, parseJwt, submitData } from "../utils";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("Auth Utils", () => {
  describe("submitData", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should call axios.post for POST method", async () => {
      mockedAxios.post.mockResolvedValueOnce({ data: { success: true } });
      const result = await submitData({
        route: "/test",
        method: Method.POST,
        data: { foo: "bar" },
      });
      expect(mockedAxios.post).toHaveBeenCalled();
      expect(result).toEqual({ success: true });
    });

    it("should call axios.get for GET method", async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: { success: true } });
      await submitData({ route: "/test", method: Method.GET });
      expect(mockedAxios.get).toHaveBeenCalled();
    });

    it("should call axios.put for PUT method", async () => {
      mockedAxios.put.mockResolvedValueOnce({ data: { success: true } });
      await submitData({ route: "/test", method: Method.PUT, data: {} });
      expect(mockedAxios.put).toHaveBeenCalled();
    });

    it("should call axios.delete for DELETE method", async () => {
      mockedAxios.delete.mockResolvedValueOnce({ data: { success: true } });
      await submitData({ route: "/test", method: Method.DELETE });
      expect(mockedAxios.delete).toHaveBeenCalled();
    });

    it("should call axios.patch for PATCH method", async () => {
      mockedAxios.patch.mockResolvedValueOnce({ data: { success: true } });
      await submitData({ route: "/test", method: Method.PATCH, data: {} });
      expect(mockedAxios.patch).toHaveBeenCalled();
    });

    it("should throw error for unsupported method", async () => {
      await expect(
        submitData({ route: "/test", method: "INVALID" as unknown as Method }),
      ).rejects.toThrow("Unsupported method: INVALID");
    });
  });

  describe("parseJwt", () => {
    it("should parse a valid JWT", () => {
      const payload = { sub: "123", name: "John" };
      const token = `header.${btoa(JSON.stringify(payload))}.signature`;
      expect(parseJwt(token)).toEqual(payload);
    });

    it("should return null for an invalid JWT", () => {
      expect(parseJwt("invalid-token")).toBeNull();
    });
  });

  describe("isTokenExpired", () => {
    it("should return true if token is expired", () => {
      const now = Math.floor(Date.now() / 1000);
      const payload = { exp: now - 3600 };
      const token = `header.${btoa(JSON.stringify(payload))}.signature`;
      expect(isTokenExpired(token)).toBe(true);
    });

    it("should return false if token is not expired", () => {
      const now = Math.floor(Date.now() / 1000);
      const payload = { exp: now + 3600 };
      const token = `header.${btoa(JSON.stringify(payload))}.signature`;
      expect(isTokenExpired(token)).toBe(false);
    });

    it("should return true if token has no exp claim", () => {
      const payload = { sub: "123" };
      const token = `header.${btoa(JSON.stringify(payload))}.signature`;
      expect(isTokenExpired(token)).toBe(true);
    });
  });
});
