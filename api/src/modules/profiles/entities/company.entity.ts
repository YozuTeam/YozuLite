export class CompanyProfileEntity {
  id: string;
  userId: string;
  companyName: string;
  description: string | null;
  industry: string | null;
  competences: string[];
  contractType: string[];

  constructor(
    id: string,
    userId: string,
    companyName: string,
    description?: string | null,
    industry?: string | null,
    competences?: string[],
    contractType?: string[],
  ) {
    this.id = id;
    this.userId = userId;
    this.companyName = companyName;
    this.description = description ?? null;
    this.industry = industry ?? null;
    this.competences = competences ?? [];
    this.contractType = contractType ?? [];
  }
}
