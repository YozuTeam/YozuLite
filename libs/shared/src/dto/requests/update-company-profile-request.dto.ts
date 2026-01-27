import { IsArray, IsOptional, IsString } from "class-validator";
import { IUpdateCompanyProfileRequest } from "../../interfaces/requests/update-company-profile-request.interface";

export class UpdateCompanyProfileRequest
  implements IUpdateCompanyProfileRequest
{
  @IsOptional() @IsString() companyName?: string;
  @IsOptional() @IsString() description?: string | null;
  @IsOptional() @IsString() industry?: string | null;
  @IsOptional() @IsArray() techStack?: string[];
}
