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
import { mealType, cuisineType, foodType } from "@fbe/types";

export enum status {
  available = "available",
  pending = "pending",
  failed = "failed",
  completed = "completed",
}

export class MenuItemBodyDto {
  @ApiProperty({
    description: "name",
    example: "paneer tikka masala",
    required: true,
  })
  @IsDefined()
  @IsString()
  name!: string;

  @ApiProperty({
    description: "description",
    example:
      "Paneer tikka or Paneer Soola is an Indian dish made from chunks of paneer marinated in spices and grilled in a tandoor...",
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: "ingredients",
    example: "paneer, spices, cream",
    required: false,
  })
  @IsOptional()
  @IsString()
  ingredients?: string;

  @ApiProperty({
    description: "food_type",
    enum: foodType,
    example: foodType.vegan,
    required: true,
  })
  @IsDefined()
  @IsEnum(foodType)
  food_type!: foodType;

  @ApiProperty({
    description: "quantity",
    example: 500,
    required: true,
  })
  @IsDefined()
  @IsNumber()
  quantity!: number;

  @ApiProperty({
    description: "quantity_unit",
    example: "grams",
    required: false,
  })
  @IsOptional()
  @IsString()
  quantity_unit?: string;

  @ApiProperty({
    description: "posted_at",
    example: "2025-04-30T00:00:00Z",
    required: false,
  })
  @IsOptional()
  @IsDateString()
  posted_at?: Date;

  @ApiProperty({
    description: "expires_at",
    example: "2025-05-30T00:00:00Z",
    required: false,
  })
  @IsOptional()
  @IsDateString()
  expires_at?: Date;

  @ApiProperty({
    description: "notes",
    example: "Contains dairy and nuts.",
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({
    description: "status",
    enum: status,
    example: status.available,
    required: true,
  })
  @IsDefined()
  @IsEnum(status)
  status!: status;

  @ApiProperty({
    description: "thumbnails",
    example: "https://example.com/image.png",
    required: false,
  })
  @IsOptional()
  @IsString()
  thumbnails?: string;
}

export class CreatePaymentBodyDto {
  @ApiProperty({
    description: "business_id",
    example: "5272ec36-d9db-11ed-afa1-0242ac120002",
    required: true,
  })
  @IsUUID()
  @IsString()
  public business_id!: string;

  @ApiProperty({
    description: "order_id",
    example: "5272ec36-d9db-11ed-afa1-0242ac120002",
    required: true,
  })
  @IsUUID()
  @IsString()
  public order_id!: string;

  @ApiProperty({
    description: "delivery_id",
    example: "093df604-c6cf-4aff-bd4e-6e1ae7267941",
    required: true,
  })
  @IsString()
  public delivery_id!: string;

  @ApiProperty({
    description: "delivery_acc_id",
    example: "acct_1RNz2p4DDu1hL5FF",
    required: true,
  })
  @IsString()
  public delivery_acc_id!: string;

  @ApiProperty({
    description: "menu_item object",
    example: [
      {
        id: "5272ec36-d9db-11ed-afa1-0242ac120009",
        name: "paneer tikka masala",
        description:
          "Paneer tikka or Paneer Soola or Chhena Soola is an Indian dish made from chunks of paneer/ chhena marinated in spices and grilled in a tandoor. It is a vegetarian alternative to chicken tikka and other meat dishes. It is a popular dish that is widely available in India and countries with an Indian diaspora",
        ingredients: "ingredients",
        food_type: "vegan",
        quantity: 500,
        quantity_unit: "grams",
        posted_at: "2025-04-30T00:00:00Z",
        expires_at: "2025-05-30T00:00:00Z",
        notes: "Contains dairy and nuts.",
        status: "available",
        thumbnails: "https://google.com/banner.png",
      },
    ],
    required: true,
  })
  @IsArray()
  @ValidateNested()
  @ValidateType(() => MenuItemBodyDto)
  public menu_items!: MenuItemBodyDto[];
}

export class UpdatePaymentBodyDto extends PartialType(CreatePaymentBodyDto) {
  @ApiProperty({
    description: "status",
    example: "success/failure",
    required: true,
  })
  @IsString()
  public status!: string;
}

export class UpdateByIdDto {
  @ApiProperty({
    description: "payment_id",
    example: "5272ec36-d9db-11ed-afa1-0242ac120002",
    required: true,
  })
  @IsUUID()
  public id!: string;
}

export enum Status {
  "success" = "success",
  "failure" = "failure",
}

export class UpdateByIdQueryDto {
  @ApiProperty({
    description: "success/failure",
    example: Status.success,
    enum: Status,
    required: true,
  })
  @IsEnum(Status)
  @IsString()
  public status!: string;
}
