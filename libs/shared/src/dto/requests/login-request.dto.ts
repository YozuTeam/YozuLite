import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { ILoginRequest } from "@yozu/contracts";

export class LoginRequest implements ILoginRequest {
  @ApiProperty({
    description: "Email or phone number of the user",
    example: "john@doe.com",
  })
  @IsString()
  emailOrPhone!: string;

  @ApiProperty({
    description: "User password",
    example: "Secret123!",
  })
  @IsString()
  password!: string;
}
