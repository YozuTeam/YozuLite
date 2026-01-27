import * as authApi from "@/auth/api";

describe("Debug AuthApi", () => {
  it("should have callAPI", () => {
    console.log("authApi keys:", Object.keys(authApi));
    expect(authApi.callAPI).toBeDefined();
  });
});
