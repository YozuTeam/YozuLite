import { Role } from "../../enums/role.enums";
import { ICreateUserRequest } from "../../interfaces/requests/create-user-request.interface";
export declare class CreateUserRequest implements ICreateUserRequest {
    email: string;
    password: string;
    phoneNumber: string;
    role?: Role;
}
