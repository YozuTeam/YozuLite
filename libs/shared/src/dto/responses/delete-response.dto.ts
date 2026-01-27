import { ApiProperty } from "@nestjs/swagger";
import { IDeleteResponse } from "@yozu/contracts";

export class DeleteResponse implements IDeleteResponse {
  @ApiProperty({
    description: "Indicates successful deletion",
    example: true,
  })
  success!: true;
}
