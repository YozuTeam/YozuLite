import { IUpdateCompanyProfileRequest } from "../../interfaces/requests/update-company-profile-request.interface";
export declare class UpdateCompanyProfileRequest implements IUpdateCompanyProfileRequest {
    companyName?: string;
    description?: string | null;
    industry?: string | null;
    techStack?: string[];
}
