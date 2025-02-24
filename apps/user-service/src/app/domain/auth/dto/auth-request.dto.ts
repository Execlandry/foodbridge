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
    example: "34535SDF353@#22342",
    required: true,
  })
  @IsDefined()
  @IsString()
  public password!: string;
}
