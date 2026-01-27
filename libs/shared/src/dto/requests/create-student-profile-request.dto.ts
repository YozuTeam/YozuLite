import { IsArray, IsOptional, IsString } from "class-validator";
import { ICreateStudentProfileRequest } from "../../interfaces/requests/create-student-profile-request.interface";

export class CreateStudentProfileRequest
  implements ICreateStudentProfileRequest
{
  @IsString() firstName!: string;
  @IsString() lastName!: string;
  @IsOptional() @IsString() bio?: string | null;
  @IsOptional() @IsString() school?: string | null;
  @IsOptional() @IsArray() skills?: string[];
}
