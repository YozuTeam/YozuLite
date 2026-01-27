import { IsArray, IsOptional, IsString } from "class-validator";
import { IUpdateStudentProfileRequest } from "../../interfaces/requests/update-student-profile-request.interface";

export class UpdateStudentProfileRequest
  implements IUpdateStudentProfileRequest
{
  @IsOptional() @IsString() firstName?: string;
  @IsOptional() @IsString() lastName?: string;
  @IsOptional() @IsString() bio?: string | null;
  @IsOptional() @IsString() school?: string | null;
  @IsOptional() @IsArray() skills?: string[];
}
