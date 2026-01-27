import { Role } from "../../enums/role.enums";
export interface ICreateUserRequest {
    email: string;
    password: string;
    phoneNumber: string;
    role?: Role;
}
