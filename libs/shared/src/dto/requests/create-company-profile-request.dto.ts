import { IsArray, IsOptional, IsString } from "class-validator";
import { ICreateCompanyProfileRequest } from "../../interfaces/requests/create-company-profile-request.interface";

export class CreateCompanyProfileRequest
  implements ICreateCompanyProfileRequest
{
  @IsString() companyName!: string;
  @IsOptional() @IsString() description?: string | null;
  @IsOptional() @IsString() industry?: string | null;
  @IsOptional() @IsArray() techStack?: string[];
}
