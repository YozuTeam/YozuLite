export class CompanyProfileModel {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public companyName: string,
    public description: string | null,
    public industry: string | null,
    public techStack: string[],
  ) {}
}
