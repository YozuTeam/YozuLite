export class StudentProfileModel {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public firstName: string,
    public lastName: string,
    public bio: string | null,
    public contractType: string[],
    public skills: string[],
  ) {}

  get fullName() {
    return `${this.firstName} ${this.lastName}`.trim();
  }
}
