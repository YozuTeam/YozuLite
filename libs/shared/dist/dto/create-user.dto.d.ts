import { Role } from "../enums/role.enums";
export declare class CreateUserDto {
    email: string;
    password: string;
    phoneNumber: string;
    role?: Role;
}
