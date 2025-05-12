import { Injectable, Logger } from '@nestjs/common';
import { LocationUpdateDto } from './dto/location-update.dto';

@Injectable()
export class LocationService {
  private readonly logger = new Logger(LocationService.name);
  
  private latestLocations: Map<string, LocationUpdateDto> = new Map();

  storeLocation(update: LocationUpdateDto): void {
    const key = `${update.orderId}:${update.deliveryId}`;
    this.latestLocations.set(key, update);
    this.logger.debug(`Stored location for ${key}`);
  }

  getLatestLocation(orderId: string, userId: string): LocationUpdateDto | undefined {
    const key = `${orderId}:${userId}`;
    return this.latestLocations.get(key);
  }

  getAllLocationsByOrder(orderId: string): LocationUpdateDto[] {
    const locations: LocationUpdateDto[] = [];
    
    for (const [key, location] of this.latestLocations.entries()) {
      if (key.startsWith(`${orderId}:`)) {
        locations.push(location);
      }
    }
    
    return locations;
  }
}