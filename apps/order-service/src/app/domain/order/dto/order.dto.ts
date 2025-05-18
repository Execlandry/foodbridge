import { ApiProperty, PartialType } from "@nestjs/swagger";
import { Transform, Type as ValidateType } from "class-transformer";
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDateString,
  IsDefined,
  IsEmail,
  IsEnum,
  IsNumber,
  isObject,
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

export enum status {
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

  // @ApiProperty({
  //   description: "meal_type",
  //   required: true,
  //   enum: mealType,
  //   example: mealType.breakfast,
  // })
  // @IsEnum(mealType)
  // public meal_type!: string;

  // @ApiProperty({
  //   description: "category",
  //   example: "category",
  //   required: true,
  // })
  // @IsOptional()
  // @IsString()
  // public category!: string;

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
    example: 3,
    required: true,
  })
  @IsString()
  public quantity!: string;

  @ApiProperty({
    description: "status",
    required: true,
    enum: status,
    example: status.available,
  })
  @IsEnum(status)
  public status!: string;
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
    // required: true,
  })
  @IsOptional()
  @IsString()
  public thumbnails!: string;
}

export class CreatePaymentBodyDto {
  @ApiProperty({
    description: "business",
    example: {
      id: "dee90081-616b-4744-b2fd-7ee11f38070a",
      name: "Kanha Veg Business",
      description: "Veg Business in North Goa",
      owner_id: "c8584afc-f395-4892-97df-d12487e39771",
      website_url: null,
      social_links: null,
      cuisine: null,
      average_price: 1200,
      average_rating: null,
      latitude: "11",
      is_available: true,
      longitude: "11",
      contact_no: "8998978987",
      banner: "https://gogole.com/banner.png",
      delivery_options: "all",
      pickup_options: "all",
      address: {},
    },
    required: true,
  })
  @IsObject()
  public business!: any;

  @ApiProperty({
    description: "User",
    example: {
      id: "dee90081-616b-4744-b2fd-7ee11f38070a",
      name: "Kanha Veg Business",
    },
    required: true,
  })
  @IsObject()
  public user!: any;

  // @ApiProperty({
  //   description: "driver_id",
  //   example: "5272ec36-d9db-11ed-afa1-0242ac120002",
  //   required: false,
  // })
  // public driver_id!: string;

  // @ApiProperty({
  //   description: "driver",
  //   example: {
  //     mobno: "1234567891",
  //     availability: false,
  //     location: "porvorim",
  //     ratings: 4,
  //   },
  //   required: false,
  // })
  // @IsObject()
  // public driver!: any;

  @ApiProperty({
    description: "address obj",
    example: {
      id: "3bd5a21a-3410-48f6-84ff-138dc8dd30db",
      name: "Aguada Road",
      city: "Candolim",
      lat: "15.501107",
      long: "73.769915",
      street: "Bamon Vaddo",
      pincode: "403515",
      country: "INDIA",
      state: "Goa",
    },
    required: true,
  })
  @IsObject()
  public address!: any;

  @ApiProperty({
    description: "Request for driver",
    example: false,
    required: false,
  })
  @IsBoolean()
  public request_for_driver!: boolean;

  @ApiProperty({
    description: "amount",
    example: "200",
    required: true,
  })
  public amount!: string;

  @ApiProperty({
    description: "menu_item object",
    example: [
      {
        id: "5272ec36-d9db-11ed-afa1-0242ac120009",
        name: "paneer tikka masala",
        description:
          "Paneer tikka or Paneer Soola or Chhena Soola is an Indian dish made from chunks of paneer/ chhena marinated in spices and grilled in a tandoor. It is a vegetarian alternative to chicken tikka and other meat dishes. It is a popular dish that is widely available in India and countries with an Indian diaspora",
        // cuisine_type: "indian",
        // meal_type: "breakfast",
        // category: "category",
        ingredients: "ingredients",
        food_type: "vegan",
        // count: 1,
        quantity: 3,
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

export class UpdateByIdDto {
  @ApiProperty({
    description: "order_id",
    example: "5272ec36-d9db-11ed-afa1-0242ac120002",
    required: true,
  })
  @IsUUID()
  public id!: string;
}

export enum PaymentStatus {
  "success" = "success",
  "failure" = "failure",
}

export enum OrderStatus {
  "intitated" = "initiated",
  "accepted" = "accepted",
  "pickuped" = "pickuped",
  "delivered" = "delivered",
  "failed" = "failed",
}

// export class UpdateByIdQueryDto {
//   @ApiProperty({
//     description: "success/failure",
//     example: PaymentStatus.success,
//     enum: PaymentStatus,
//     required: true,
//   })
//   @IsEnum(PaymentStatus)
//   @IsString()
//   public status!: string;
// }

export class UpdatePaymentBodyDto extends PartialType(CreatePaymentBodyDto) {}
