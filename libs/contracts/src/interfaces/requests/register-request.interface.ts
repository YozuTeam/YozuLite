import { Role } from "../../enums/role.enums";

export interface IRegisterRequest {
  email: string;
  password: string;
  phoneNumber: string;
  role?: Role;
}
