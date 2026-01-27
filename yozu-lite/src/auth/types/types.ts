import { Method } from "../constants";

export type CallApiProps<T> = {
  route: string;
  method: Method;
  data?: T;
  isPublicRoute?: boolean;
};

export type ApiResult<R> = {
  ok: boolean;
  data?: R;
  status?: number;
  errorMessage?: string;
};

export type ApiError = {
  status?: number;
  code?: string;
  message: string;
  details?: unknown;
  route?: string;
  method?: string;
};
