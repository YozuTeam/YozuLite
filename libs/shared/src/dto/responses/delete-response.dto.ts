import { ApiProperty } from "@nestjs/swagger";
import { IDeleteResponse } from "../../interfaces/responses/delete-response.interface";

export class DeleteResponse implements IDeleteResponse {
  @ApiProperty({
    description: "Indicates successful deletion",
    example: true,
  })
  success!: true;
}
