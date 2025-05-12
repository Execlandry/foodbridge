import { IsNotEmpty, IsNumber, IsObject, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class GeoPosition {
  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;
}

export class LocationUpdateDto {
  @IsNotEmpty()
  @IsString()
  deliveryId: string;

  @IsNotEmpty()
  @IsString()
  orderId: string;

  @IsNotEmpty()
  @IsString()
  orderType: string; // 'pickup' or 'delivery'

  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  @Type(() => GeoPosition)
  location: GeoPosition;

  @IsNumber()
  heading: number;

  @IsString()
  timestamp: string;
}