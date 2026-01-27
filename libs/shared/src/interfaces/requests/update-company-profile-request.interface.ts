export interface IUpdateCompanyProfileRequest {
  companyName?: string;
  description?: string | null;
  industry?: string | null;
  techStack?: string[];
}
