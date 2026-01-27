import { IAuthResponse } from "@yozu/contracts";

export function getAccessToken() {
  return localStorage.getItem("accessToken");
}

export function getRefreshToken() {
  return localStorage.getItem("refreshToken");
}

export function setAccessToken(token: string) {
  localStorage.setItem("accessToken", token);
}

export function setRefreshToken(token: string) {
  localStorage.setItem("refreshToken", token);
}

export const saveTokens = (data: IAuthResponse) => {
  if (data.accessToken) setAccessToken(data.accessToken);
  if (data.refreshToken) setRefreshToken(data.refreshToken);
};
