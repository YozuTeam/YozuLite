import { Role } from "../../enums/role.enums";
import { IUpdateUserRequest } from "../../interfaces/requests/update-user-request.interface";
export declare class UpdateUserRequest implements IUpdateUserRequest {
    email?: string;
    password?: string;
    phoneNumber?: string;
    role?: Role;
}
