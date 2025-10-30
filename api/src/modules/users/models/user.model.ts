import { Role } from '@/common/enums/role.enums';

export class UserModel {
  constructor(
    public readonly id: string,
    public email: string,
    public role: Role,
    public phoneNumber: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  isCompany() {
    return this.role === Role.COMPANY;
  }
  isStudent() {
    return this.role === Role.STUDENT;
  }
}
