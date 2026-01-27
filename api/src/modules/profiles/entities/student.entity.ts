export class StudentProfileEntity {
  id!: string;
  userId!: string;
  firstName!: string;
  lastName!: string;
  bio?: string | null;
  contractType!: string[];
  skills!: string[];
  constructor(
    id: string,
    userId: string,
    firstName: string,
    lastName: string,
    bio?: string | null,
    contractType?: string[],
    skills?: string[],
  ) {
    this.id = id;
    this.userId = userId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.bio = bio ?? null;
    this.contractType = contractType ?? [];
    this.skills = skills ?? [];
  }
}
