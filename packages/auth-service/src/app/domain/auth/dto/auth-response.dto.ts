import { ApiProperty, ApiResponseProperty } from "@nestjs/swagger";
import { IsDefined, IsEmail, IsString } from "class-validator";

export class UserSignInResponseDto{
     // uuid
  @ApiResponseProperty({
    example: "da9b9f51-23b8-4642-97f7-52537b3cf53b",
    format: "v4",
  })
  public userId: string;

  @ApiResponseProperty({
    example: "user@gmail.com",
  })
  public email: string;

  @ApiResponseProperty({
    example: new Date().toDateString(),
  })
  public expiration: string;

  @ApiResponseProperty({
    example: "admin",
  })
  public permission: string;

  @ApiResponseProperty({
    example: "dsojfawf.ewu03ufdsjfsk.jfalflja",
  })
  public access_token: string[];

}