import { UserModel } from "../../models/user.model";
export interface IAuthResponse {
    user: Omit<UserModel, "password">;
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    refreshExpiresIn: number;
}
