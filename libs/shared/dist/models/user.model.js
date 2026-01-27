"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const role_enums_1 = require("../enums/role.enums");
class UserModel {
    constructor(id, email, role, password, phoneNumber, createdAt, updatedAt) {
        this.id = id;
        this.email = email;
        this.role = role;
        this.password = password;
        this.phoneNumber = phoneNumber;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    isCompany() {
        return this.role === role_enums_1.Role.COMPANY;
    }
    isStudent() {
        return this.role === role_enums_1.Role.STUDENT;
    }
}
exports.UserModel = UserModel;
//# sourceMappingURL=user.model.js.map