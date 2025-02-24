import { ApiProperty, PartialType } from "@nestjs/swagger";
import { Transform, Type as ValidateType } from "class-transformer";
import {
  IsArray,
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

export class BusinessParamParamDto {
  @ApiProperty({
    description: "[business id ] as uuid",
    example: "",
    required: true,
  })
  @IsUUID()
  public id!: string;
}

export class UpdateDishItemParamDto extends BusinessParamParamDto {
  @ApiProperty({
    description: "[dish_id ] as uuid",
    example: "",
    required: true,
  })
  @IsUUID()
  public dish_id!: string;
}

export class createBusinessDishBodyDto {
  @ApiProperty({
    description: "name",
    example: "Tulum",
    required: true,
  })
  @IsDefined()
  @IsString()
  public name!: string;

  @ApiProperty({
    description: "description",
    example: "desc",
    required: true,
  })
  @IsOptional()
  @IsString()
  public description!: string;

  @ApiProperty({
    description: "category",
    example: "category",
    required: true,
  })
  @IsOptional()
  @IsString()
  public category!: string;

  @ApiProperty({
    description: "ingredients",
    example: "ingredients",
    required: true,
  })
  @IsOptional()
  @IsString()
  public ingredients!: string;

  @ApiProperty({
    description: "food_type",
    example: "food_type",
    required: true,
  })
  @IsOptional()
  @IsString()
  public food_type!: string;

  @ApiProperty({
    description: "price",
    example: 500,
    required: true,
  })
  @IsNumber()
  public price!: number;

  @ApiProperty({
    description: "thumbnails",
    example: ["https://google.com/banner.png"],
    required: true,
  })
  @IsOptional()
  @IsArray()
  @IsString({each:true})
  public thumbnails!: string[];
}

export class UpdateBusinessDishBodyDto extends PartialType(
  createBusinessDishBodyDto
) {}
