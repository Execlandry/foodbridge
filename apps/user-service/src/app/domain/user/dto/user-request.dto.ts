import { ApiProperty, PartialType } from "@nestjs/swagger";
import {
  IsBoolean,
  IsDefined,
  IsEmail,
  IsEnum,
  IsNumberString,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Matches,
  MinLength,
  ValidateNested,
} from "class-validator";
import { Type as validateType } from "class-transformer";
import { UserRoles } from "@fbe/types";
import { UserSignupResponseDto } from "./user-response.dto";

export class PartnerResponseDto extends UserSignupResponseDto {
  @ApiProperty({ example: true })
  availability: boolean;
}

export class UserNestedDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  permissions: string;
}

export class FullPartnerDetailsDto {
  
  @ApiProperty()
  availability: boolean;
  
  @ApiProperty()
  ratings: string;
  
  @ApiProperty()
  mobno: string;
  
  @ApiProperty()
  stripe_id: string;

  @ApiProperty()
  onboarded:boolean;
  
  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;

  @ApiProperty({ type: UserNestedDto })
  user: UserNestedDto;
}

export class DeliveryPartnerSignupDto {
  @ApiProperty({
    description: "username",
    example: "john",
    required: false,
  })
  @IsOptional()
  @IsString()
  public name!: string;

  @ApiProperty({
    description: "email",
    example: "user@gmail.com",
    required: true,
  })
  @IsDefined()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: "Mobile number of the user",
    example: "9876543210",
    type: String,
  })
  @IsNumberString()
  @Length(10, 15)
  @Matches(/^\+?[1-9]\d{9,14}$/)
  mobno: string;

  @ApiProperty({
    description: "password",
    example: "letmeinplease",
    required: true,
  })
  @IsDefined()
  @IsString()
  @MinLength(8)
  public password!: string;
}

export class GetDeliveryPartnerbyId {
  @ApiProperty({
    description: "id",
    example: "id",
    required: true,
  })
  @IsUUID()
  @IsString()
  public id!: string;
}

export class GetDeliveryPartnerAvailability {
  @ApiProperty({
    description: "Partner availability status",
    example: true,
    required: true,
  })
  @IsBoolean()
  public availability!: boolean;
}
export class CreateAddressDto {
  @ApiProperty({
    description: "city",
    example: "Candolim",
    required: true,
  })
  @IsDefined()
  @IsString()
  public city!: string;

  @ApiProperty({
    description: "state",
    example: "Goa",
    required: true,
  })
  @IsDefined()
  @IsString()
  public state!: string;

  @ApiProperty({
    description: "lat",
    example: "15.501107",
    required: true,
  })
  @IsOptional()
  @IsString()
  public lat!: string;

  @ApiProperty({
    description: "long",
    example: "73.769915",
    required: true,
  })
  @IsOptional()
  @IsString()
  public long!: string;

  @ApiProperty({
    description: "country",
    example: "INDIA",
    required: true,
  })
  @IsDefined()
  @IsString()
  public country!: string;

  @ApiProperty({
    description: "pin_code",
    example: "403515",
    required: true,
  })
  @IsDefined()
  @IsString()
  public pincode!: string;

  @ApiProperty({
    description: "street",
    example: "Bamon Vaddo",
    required: true,
  })
  @IsDefined()
  @IsString()
  public street!: string;

  @ApiProperty({
    description: "full address",
    example: "Aguada Road",
    required: true,
  })
  @IsDefined()
  @IsString()
  public name!: string;
}

export class UserSignupDto {
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
    description: "Charity Name",
    example: "Helping Hands",
    required: false,
  })
  @IsOptional()
  @IsString()
  public name!: string;

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
    description: "http:123",
    example: "http:123",
    required: false,
  })
  @IsOptional()
  @IsString()
  public picture_url!: string;

  @ApiProperty({
    description: "12312",
    example: "123123123",
    required: false,
  })
  @IsOptional()
  @IsString()
  public mobno!: string;

  @ApiProperty({
    description: "password",
    example: "letmeinplease",
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
