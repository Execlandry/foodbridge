import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsString, IsEmail, IsOptional } from "class-validator";

export class UserSignInDto {
  @ApiProperty({
    description: "email",
    example: "hello@gmail.com",
    required: true,
  })
  @IsDefined()
  @IsString()
  @IsEmail()
  public email!: string;

  @ApiProperty({
    description: "password",
    example: "useme",
    required: true,
  })
  @IsDefined()
  @IsString()
  public password!: string;
}
