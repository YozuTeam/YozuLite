export interface ICreateCompanyProfileRequest {
  companyName: string;
  description?: string | null;
  industry?: string | null;
  competences?: string[];
  contractType?: string[];
}
