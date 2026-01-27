import { Method } from "./constants";
import axios, { AxiosResponse } from "axios";
import { BACKEND_URL } from "./constants";

export async function submitData<T, R>(props: {
  route: string;
  method: Method;
  data?: T;
  headers?: Record<string, string>;
}): Promise<R> {
  const path = `${BACKEND_URL}${props.route}`;
  try {
    let response: AxiosResponse<R>;
    if (props.method === Method.POST) {
      response = await axios.post(path, props.data, { headers: props.headers });
    } else if (props.method === Method.GET) {
      response = await axios.get(path, { headers: props.headers });
    } else if (props.method === Method.PUT) {
      response = await axios.put(path, props.data, { headers: props.headers });
    } else if (props.method === Method.DELETE) {
      response = await axios.delete(path, { headers: props.headers });
    } else if (props.method === Method.PATCH) {
      response = await axios.patch(path, props.data, {
        headers: props.headers,
      });
    } else {
      throw new Error(`Unsupported method: ${props.method}`);
    }
    return response.data;
  } catch (error) {
    console.error("Error submitting data:", error);
    throw error;
  }
}

export function parseJwt(token: string) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map((c) => {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join(""),
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  const decoded = parseJwt(token);
  const isExpired = decoded?.exp ? decoded.exp * 1000 < Date.now() : true;
  console.log("Token expired:", isExpired);
  return isExpired;
}
