export interface ICompanyProfileResponse {
  id: string;
  userId: string;
  companyName: string;
  description: string | null;
  industry: string | null;
  techStack: string[];
}
