import { Role } from "../../enums/role.enums";
import { IRegisterRequest } from "../../interfaces/requests/register-request.interface";
export declare class RegisterRequest implements IRegisterRequest {
    email: string;
    password: string;
    phoneNumber: string;
    role?: Role;
}
