import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsString, IsEmail, IsOptional } from "class-validator";

export class UserSigInDto {
  @ApiProperty({
    description: "email",
    example: "user@gmail.com",
    required: true,
  })
  @IsDefined()
  @IsString()
  @IsEmail()
  public email!: string;

  @ApiProperty({
    description: "password",
    example: "letmeinplease",
    required: true,
  })
  @IsDefined()
  @IsString()
  public password!: string;
}
