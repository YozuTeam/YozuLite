import { Role } from '@/common/enums/role.enums';

export class UserEntity {
  id!: string;
  email!: string;
  password!: string;
  phoneNumber!: string;
  role!: Role;
  createdAt!: Date;
  updatedAt!: Date;
  constructor(
    id: string,
    email: string,
    password: string,
    phoneNumber: string,
    role: Role,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.phoneNumber = phoneNumber;
    this.role = role;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
