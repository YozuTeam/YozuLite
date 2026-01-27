import { Role } from "../enums/role.enums";
export declare class UserModel {
    readonly id: string;
    email: string;
    role: Role;
    password: string;
    phoneNumber: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    constructor(id: string, email: string, role: Role, password: string, phoneNumber: string, createdAt: Date, updatedAt: Date);
    isCompany(): boolean;
    isStudent(): boolean;
}
