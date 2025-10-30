export class CompanyProfileModel {
  constructor(
    public readonly id: number,
    public readonly userId: string,
    public companyName: string,
    public description: string | null,
    public industry: string | null,
    public techStack: string[],
  ) {}
}
