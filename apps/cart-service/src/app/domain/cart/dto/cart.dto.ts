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
import { mealType, cuisineType, foodType } from "@fbe/types";

enum status {
  "available" = "available",
  "pending" = "pending",
  "failed" = "failed",
  "completed" = "completed",
}

export class MenuItemBodyDto {
  @ApiProperty({
    description: "id",
    example: "5272ec36-d9db-11ed-afa1-0242ac120002",
    required: true,
  })
  @IsDefined()
  @IsString()
  public id!: string;

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

  // @ApiProperty({
  //   description: "cuisine_type",
  //   required: true,
  //   enum: cuisineType,
  //   example: cuisineType.indian,
  // })
  // @IsEnum(cuisineType)
  // public cuisine_type!: string;

  @ApiProperty({
    description: "expires_at",
    example: "2025-05-30T00:00:00Z",
    required: false,
  })
  @IsOptional()
  @IsDateString()
  public expires_at!: Date;

  @ApiProperty({
    description: "Ingredients",
    example: "Ingredient",
    required: true,
  })
  @IsOptional()
  @IsString()
  public ingredients!: string;

  @ApiProperty({
    description: "quantity",
    example: "quantity",
    required: true,
  })
  @IsOptional()
  @IsString()
  public quantity!: string;

  // @ApiProperty({
  //   description: "ingredients",
  //   example: "ingredients",
  //   required: true,
  // })
  // @IsOptional()
  // @IsString()
  // public ingredients!: string;

  @ApiProperty({
    description: "food_type",
    required: true,
    enum: foodType,
    example: foodType.vegan,
  })
  @IsEnum(foodType)
  public food_type!: string;

  @ApiProperty({
    description: "status",
    required: true,
    enum: status,
    example: status.available,
  })
  @IsEnum(status)
  public status!: string;

  // @ApiProperty({
  //   description: "price",
  //   example: 500,
  //   required: true,
  // })
  // @IsNumber()
  // public price!: number;

  // @ApiProperty({
  //   description: "number of items",
  //   example: 2,
  //   required: true,
  // })
  // @IsOptional()
  // @IsNumber()
  // public count!: number;

  @ApiProperty({
    description: "thumbnails",
    example: "https://google.com/banner.png",
    required: true,
  })
  @IsOptional()
  @IsString()
  public thumbnails!: string;
}

export class CreateCartMenuItemBodyDto {
  @ApiProperty({
    description: "business_id",
    example: "5272ec36-d9db-11ed-afa1-0242ac120002",
    required: true,
  })
  @IsUUID()
  @IsString()
  public business_id!: string;

  @ApiProperty({
    description: "business",
    example: {},
    required: true,
  })
  @IsObject()
  public business!: any;

  @ApiProperty({
    description: "menu_item object",
    example: {
      id: "5272ec36-d9db-11ed-afa1-0242ac120009",
      name: "paneer tikka masala",
      description:
        "Paneer tikka or Paneer Soola or Chhena Soola is an Indian dish made from chunks of paneer/ chhena marinated in spices and grilled in a tandoor. It is a vegetarian alternative to chicken tikka and other meat dishes. It is a popular dish that is widely available in India and countries with an Indian diaspora",
      // cuisine_type: "indian",
      // meal_type: "breakfast",
      // category: "category",
      // ingredients: "ingredients",
      food_type: "vegan",
      status: "available",
      ingredients: "ingredient",
      quantity: "10",
      // count: 1,
      // price: 500,
      thumbnails: "https://google.com/banner.png",
    },
    required: true,
  })
  @IsObject()
  @ValidateNested()
  @ValidateType(() => MenuItemBodyDto)
  public menu_item!: MenuItemBodyDto;
}

export class UpdateCartMenuItemBodyDto extends PartialType(
  CreateCartMenuItemBodyDto
) {}
