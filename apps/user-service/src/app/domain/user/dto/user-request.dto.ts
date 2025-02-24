import { ApiProperty, PartialType } from "@nestjs/swagger";
import {
  IsDefined,
  IsEmail,
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
  ValidateNested,
} from "class-validator";
import { Type as validateType } from "class-transformer";
import { UserRoles } from "@fbe/types";

export class UserSignupDto {
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
    description: "firstName",
    example: "john",
    required: false,
  })
  @IsOptional()
  @IsString()
  public first_name!: string;

  @ApiProperty({
    description: "lastName",
    example: "doe",
    required: false,
  })
  @IsOptional()
  @IsString()
  public last_name!: string;

  @ApiProperty({
    description: "password",
    example: "34535SDF353@#22342",
    required: true,
  })
  @IsDefined()
  @IsString()
  @MinLength(8)
  public password!: string;
}

export class UpdateUserByIdDto {
  @ApiProperty({
    description: "uuid user_id",
    example: "",
    required: true,
  })
  @IsUUID()
  public id!: string;
}
export class UpdateUserPermissionBodyDto {
  @ApiProperty({
    description: "uuid user_id",
    example: "",
    enum: UserRoles,
  })
  @IsEnum(UserRoles)
  public permissions!: UserRoles;
}

export class FindUserDto {
  @ApiProperty({
    description: "email",
    example: "demo@gmail.com",
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsEmail()
  public email!: string;

  @ApiProperty({
    description: "name",
    example: "",
    required: false,
  })
  @IsOptional()
  @IsString()
  public name!: string;

  @ApiProperty({
    description: "first_name",
    example: "",
    required: false,
  })
  @IsOptional()
  @IsString()
  public first_name!: string;

  @ApiProperty({
    description: "last_name",
    example: "",
    required: false,
  })
  @IsOptional()
  @IsString()
  public last_name!: string;
}

export class BothPassword {
  @IsDefined()
  @IsString()
  old_password: string;

  @IsDefined()
  @IsString()
  new_password: string;
}

// update user and here things will be optional
export class fieldsToUpdateDto extends PartialType(UserSignupDto) {
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @validateType(() => BothPassword)
  public password_update!: BothPassword;
}
