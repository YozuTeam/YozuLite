import { Role } from "../../enums/role.enums";

export interface IUpdateUserRequest {
  email?: string;
  password?: string;
  phoneNumber?: string;
  role?: Role;
}
