export interface IUpdateCompanyProfileRequest {
  companyName?: string;
  description?: string | null;
  industry?: string | null;
  competences?: string[];
  contractType?: string[];
}
