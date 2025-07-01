import { ApiProperty, PartialType } from "@nestjs/swagger";
import { Transform, Type as ValidateType } from "class-transformer";
import {
  ArrayMinSize,
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

export enum filterType {
  "price" = "price",
  "rating" = "rating",
  "delivery_time" = "delivery_time",
}

export enum OrderBy {
  "ASC" = "ASC",
  "DESC" = "DESC",
}

export enum status {
  "available" = "available",
  "pending" = "pending",
  "failed" = "failed",
  "completed" = "completed",
}

export enum foodType {
  "veg" = "veg",
  "non_veg" = "non_veg",
  "vegan" = "vegan",
  "fast_food" = "fast_food",
}

export class SearchDishQueryDto {
  @ApiProperty({
    description: "search_text",
    example: "paneer tikka",
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsDefined()
  public search_text!: string;

  @ApiProperty({
    description: "foodType",
    required: false,
    enum: foodType,
    example: foodType.veg,
  })
  @IsOptional()
  @IsEnum(foodType)
  public food_type!: string;

  @ApiProperty({
    description: "filterType",
    required: false,
    enum: filterType,
    example: filterType.price,
  })
  @IsOptional()
  @IsEnum(filterType)
  public filter_type!: string;

  @ApiProperty({
    description: "OrderBy",
    required: false,
    enum: OrderBy,
    example: OrderBy.ASC,
  })
  @IsOptional()
  @IsEnum(OrderBy)
  public order_by!: string;

  @ApiProperty({
    description: "page count",
    example: "1",
    required: false,
  })
  @Transform(() => Number())
  @IsOptional()
  @IsNumber()
  public page!: number;

  @ApiProperty({
    description: "limit per page",
    example: "10",
    required: false,
  })
  @Transform(() => Number())
  @IsOptional()
  @IsNumber()
  public limit!: number;
}

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

export class CreateBusinessDishBodyDto {
  @ApiProperty({
    description: "name",
    example: "paneer tikka masala",
    required: true,
  })
  @IsDefined()
  @IsString()
  public name!: string;

  @ApiProperty({
    description: "description",
    example:
      "Paneer tikka or Paneer Soola or Chhena Soola is an Indian dish made from chunks of paneer/ chhena marinated in spices and grilled in a tandoor. It is a vegetarian alternative to chicken tikka and other meat dishes. It is a popular dish that is widely available in India and countries with an Indian diaspora",
    required: true,
  })
  @IsOptional()
  @IsString()
  public description!: string;

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
    required: true,
    enum: foodType,
    example: foodType.vegan,
  })
  @IsEnum(foodType)
  public food_type!: string;

  @ApiProperty({
    description: "quantity",
    example: 500,
    required: true,
  })
  @IsNumber()
  @IsDefined()
  public quantity!: number;

  @ApiProperty({
    description: "quantity_unit",
    example: "grams",
    required: true,
  })
  @IsString()
  @IsOptional()
  public quantity_unit!: string;

  @ApiProperty({
    description: "posted_at",
    example: "2025-04-30T00:00:00Z",
    required: false,
  })
  @IsOptional()
  @IsDateString()
  public posted_at!: Date;

  @ApiProperty({
    description: "expires_at",
    example: "2025-05-30T00:00:00Z",
    required: false,
  })
  @IsOptional()
  @IsDateString()
  public expires_at!: Date;

  @ApiProperty({
    description: "notes",
    example: "Contains dairy and nuts.",
    required: false,
  })
  @IsOptional()
  @IsString()
  public notes!: string;

  @ApiProperty({
    description: "status",
    required: true,
    enum: status,
    example: status.available,
  })
  @IsEnum(status)
  public status!: string;

  @ApiProperty({
    description: "thumbnails",
    example:
      "https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_1024/18301f1b90116218438a5e6a82336d15",
    required: true,
  })
  @IsString()
  @IsOptional()
  public thumbnails!: string;
}

export class UpdateBusinessDishBodyDto extends PartialType(
  CreateBusinessDishBodyDto
) {}
