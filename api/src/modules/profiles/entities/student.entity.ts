export class StudentProfileEntity {
  id!: string;
  userId!: string;
  firstName!: string;
  lastName!: string;
  bio?: string | null;
  school?: string | null;
  skills!: string[];
  constructor(
    id: string,
    userId: string,
    firstName: string,
    lastName: string,
    bio?: string | null,
    school?: string | null,
    skills?: string[],
  ) {
    this.id = id;
    this.userId = userId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.bio = bio ?? null;
    this.school = school ?? null;
    this.skills = skills ?? [];
  }
}
