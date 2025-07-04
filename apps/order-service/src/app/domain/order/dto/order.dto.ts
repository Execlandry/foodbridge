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
      id: "1873a2e4-9e35-40f6-bf81-cc1a2cb536c0",
      name: "patrao business",
      banner:
        "https://foodbridge-storage.s3.amazonaws.com/0a3dbbe6-94a8-4c94-a0d4-93db724fe5cb-rest-1.webp?AWSAccessKeyId=AKIA6D6JBC4PR3AXW5XR&Expires=1748082791&Signature=F0dQ43EZEnxRsPUi2rjyd4LaJCc%3D&response-content-disposition=attachment%3B%20filename%20%3D%22rest-1.webp%22",
      cuisine: null,
      latitude: "15.501107",
      opens_at: "2025-05-17T16:02",
      owner_id: "476a2ba5-0b07-49ed-a3b6-3a8a69e5f1d7",
      closes_at: "2025-05-18T16:02",
      longitude: "73.769915",
      contact_no: "9945667898",
      created_at: "2025-05-17T10:33:12.180Z",
      deleted_at: "2025-05-17T10:33:12.180Z",
      updated_at: "2025-05-17T10:33:12.180Z",
      description: "hello this is best",
      website_url: null,
      is_available: true,
      social_links: null,
      average_rating: null,
      address: {
        id: "49f2d0dc-e654-4c4b-b703-9c31fc5143d5",
        city: "Panaji",
        name: "Dona Paula View Point",
        state: "Goa",
        street: "Dona Paula Road",
        country: "India",
        pincode: "403004",
        created_at: "2025-05-17T10:33:12.180Z",
        updated_at: "2025-05-17T10:33:12.180Z",
      },
    },
    required: true,
  })
  @IsObject()
  public business!: any;

  @ApiProperty({
    description: "User",
    example: {
      id: "1f69cd5e-52fe-490e-9c7e-b5c2974c45e4",
      name: "Helping Hands",
      email: "charles@gmail.com",
      mobno: "9923490118",
      last_name: "shirodkar",
      first_name: "charles",
      picture_url:
        "https://foodbridge-storage.s3.amazonaws.com/bf884e45-61b8-44b3-b3b4-0409d9bbf5e2-helping%20hands.jpg?AWSAccessKeyId=AKIA6D6JBC4PR3AXW5XR&Expires=1748083315&Signature=1mCa8X9tud4MZTBkXuk4dVCHBJI%3D&response-content-disposition=attachment%3B%20filename%20%3D%22helping%20hands.jpg%22",
    },
    required: true,
  })
  @IsObject()
  public user!: any;

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
    example: true,
    required: false,
  })
  @IsBoolean()
  public request_for_driver!: boolean;

  @ApiProperty({
    description: "Amount",
    example: "200",
  })
  @IsOptional()
  @IsString()
  public amount?: string;

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
        quantity: "3",
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
