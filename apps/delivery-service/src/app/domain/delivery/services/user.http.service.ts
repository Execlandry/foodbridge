import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import HttpClientService from "src/lib/http.client.service";
import { ConfigService } from "@fbe/config";
import { Request } from "express";
import { Cron, CronExpression } from "@nestjs/schedule";

@Injectable()
export class UserProxyService {
  baseURL: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpClientService: HttpClientService
  ) {
    this.baseURL = this.configService.get().userServiceUrl;

    console.log('User Service Base URL from constructor:', this.baseURL);
  }
  async fetchDeliveryPartnerDetails(partnerId: string) {
    console.log('Fetching partner details from user-service:', this.baseURL);
  
    try {
      const { data } = await this.httpClientService.send({
        url: `partners/${partnerId}`,
        baseURL: this.baseURL,
        method: "GET",
      });
      return data;
    } catch (err) {
      throw err;
    }
  }
  
  // @Cron(CronExpression.EVERY_10_SECONDS)
  async markDeliveryPartnerAssigned(payload: { orderId: string; partnerId: string }) {
    console.log('Calling user service from markdeliverypartnerassigned:', this.baseURL);

    try {
      const { data } = await this.httpClientService.send({
        
        url: `partners/${payload.partnerId}/availability`,
        baseURL: this.baseURL,
        method: "PUT",
        data: { availability:false },
      });
      return data;
    } catch (err) {
      throw err;
    }
  }

  async markDeliveryPartnerUnassigned(payload: { orderId: string; partnerId: string }) {
    console.log('Calling user service from markdeliverypartnerassigned:', this.baseURL);

    try {
      const { data } = await this.httpClientService.send({
        
        url: `partners/${payload.partnerId}/availability`,
        baseURL: this.baseURL,
        method: "PUT",
        data: { availability:true },
      });
      return data;
    } catch (err) {
      throw err;
    }
  }
  
}
