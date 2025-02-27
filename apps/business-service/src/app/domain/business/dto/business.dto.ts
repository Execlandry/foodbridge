import { ApiProperty, PartialType } from "@nestjs/swagger";
import { Transform, Type as ValidateType } from "class-transformer";
import {
  IsDateString,
  IsDefined,
  IsEmail,
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  MinLength,
  ValidateNested,
} from "class-validator";
import { Type as validateType } from "class-transformer";
import { UserRoles } from "@fbe/types";

export class fetchBusinessByIdDto{
  @ApiProperty({
    description: "uuid",
    example: "uuid",
    required: true,
  })
  @IsUUID()
  public id!: string;

}
export class AddressDto {
  @ApiProperty({
    description: "city",
    example: "delhi",
    required: true,
  })
  @IsDefined()
  @IsString()
  public city!: string;

  @ApiProperty({
    description: "state",
    example: "delhi",
    required: true,
  })
  @IsDefined()
  @IsString()
  public state!: string;

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
    example: "6789876",
    required: true,
  })
  @IsDefined()
  @IsString()
  public pincode!: string;

  @ApiProperty({
    description: "street",
    example: "street",
    required: true,
  })
  @IsDefined()
  @IsString()
  public street!: string;

  @ApiProperty({
    description: "name",
    example: "name",
    required: true,
  })
  @IsDefined()
  @IsString()
  public name!: string;
}

export class SearchQueryDto {
  @ApiProperty({
    description: "latitude",
    example: "11",
    required: false,
  })
  @IsDefined()
  @IsString()
  public latitude!: string;

  @ApiProperty({
    description: "longitude",
    example: "11",
    required: false,
  })
  @IsOptional()
  @IsDefined()
  @IsString()
  public longitude!: string;

  @ApiProperty({
    description: "search_text",
    example:"",
    required:true,
  })
  @IsDefined()
  @IsString()
  public search_text!:string;

  @ApiProperty({
    description: "page count",
    example: "1",
    required: false,
  })
  @Transform(({value})=>parseInt(value))
  @IsOptional()
  @IsNumber()
  public page!: number;

  @ApiProperty({
    description: "limit per page",
    example: "10",
    required: false,
  })
  @Transform(({value})=>parseInt(value))
  @IsOptional()
  @IsNumber()
  public limit!: number;
}

export class CreateBusinessBodyDto {
  @ApiProperty({
    description: "name of business",
    example: "alchemy org",
    required: true,
  })
  @IsDefined()
  @IsString()
  public name!: string;

  @ApiProperty({
    description: "desc of business",
    example: "alchemy org",
    required: true,
  })
  @IsOptional()
  public description!: string;

  @ApiProperty({
    description: "average_price",
    example: "1200",
    required: true,
  })
  @IsOptional()
  public average_price!: string;

  @ApiProperty({
    description: "latitude",
    example: "11",
    required: true,
  })
  @IsDefined()
  @IsString()
  public latitude!: string;

  @ApiProperty({
    description: "longitude",
    example: "11",
    required: true,
  })
  @IsDefined()
  @IsString()
  public longitude!: string;

  @ApiProperty({
    description: "contact_no",
    example: "8998978987",
    required: true,
  })
  @IsOptional()
  @IsString()
  public contact_no!: string;

  @ApiProperty({
    description: "banner",
    example: "https://gogole.com/banner.png",
    required: true,
  })
  @IsOptional()
  @IsString()
  @IsUrl()
  public banner!: string;

  @ApiProperty({
    description: "delivery_options",
    example: "all",
    required: true,
  })
  @IsOptional()
  @IsString()
  public delivery_options!: string;

  @ApiProperty({
    description: "pickup_options",
    example: "all",
    required: true,
  })
  @IsOptional()
  @IsString()
  public pickup_options!: string;

  @ApiProperty({
    description: "opens_at",
    example: "2023-10-05T14:48:00.000Z",
    required: true,
  })
  @IsDateString()
  @IsString()
  public opens_at!: string;

  @ApiProperty({
    description: "closes_at",
    example: "2023-10-05T14:48:00.000Z",
    required: true,
  })
  @IsDateString()
  @IsString()
  public closes_at!: string;

  @ApiProperty({
    description: "address payload",
    example: {
      name: "Goan restuarant",
      city: "panjim",
      state: "Goa",
      street: "North Goa",
      pincode: "345254",
      country: "India",
    },
    required: true,
  })
  @IsObject()
  @IsDefined()
  @ValidateNested()
  @ValidateType(() => AddressDto)
  public address!: AddressDto;
}

export class UpdateBusinessBodyDto extends PartialType(CreateBusinessBodyDto){}