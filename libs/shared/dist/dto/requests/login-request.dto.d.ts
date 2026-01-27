import { ILoginRequest } from "../../interfaces/requests/login-request.interface";
export declare class LoginRequest implements ILoginRequest {
    emailOrPhone: string;
    password: string;
}
