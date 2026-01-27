import { Role } from "../enums/role.enums";
export declare class RegisterDto {
    email: string;
    password: string;
    phoneNumber: string;
    role?: Role;
}
