import { ICreateCompanyProfileRequest } from "../../interfaces/requests/create-company-profile-request.interface";
export declare class CreateCompanyProfileRequest implements ICreateCompanyProfileRequest {
    companyName: string;
    description?: string | null;
    industry?: string | null;
    techStack?: string[];
}
