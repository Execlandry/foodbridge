import { IsNumber, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LocationDto {
  @ApiProperty({ example: 15.2993 })
  @IsNumber()
  lat: number;

  @ApiProperty({ example: 74.124 })
  @IsNumber()
  lng: number;
}

export class VerifyOtpDto {
  @ApiProperty({ example: 122333 })
  @IsString()
  otp: string;
}
