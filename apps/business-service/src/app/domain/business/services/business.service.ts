import { ConflictException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ConfigService } from "@fbe/config";
import { Logger } from "@fbe/logger";
import { Like, Repository, Connection, QueryRunner } from "typeorm";
import * as bcrypt from "bcrypt";

import { NotFoundException } from "@nestjs/common";
import { BusinessEntity } from "../entity/business.entity";
import {
  AddressDto,
  createBusinessBodyDto,
  SearchQueryDto,
} from "../dto/business.dto";
import { BusinessAddressEntity } from "../entity/business.address.entity";
import { UserMetaData } from "../../auth/guards/user";

@Injectable()
export class BusinessService {
  constructor(
    private readonly logger: Logger,
    @InjectRepository(BusinessEntity)
    private businessRepo: Repository<BusinessEntity>,
    private readonly connection: Connection,
    private configService: ConfigService
  ) {}

  async search(query: SearchQueryDto) {}

  async createBusiness(user: UserMetaData, payload: createBusinessBodyDto) {
    let createdBusiness = null;
    console.log(payload);
    const queryRunner = this.connection.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      createdBusiness = await this.createdUserBusiness(
        payload,
        user,
        queryRunner
      );
      await this.createAddress(payload.address, createdBusiness, queryRunner);

      await queryRunner.commitTransaction();
      return createdBusiness;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
  async createdUserBusiness(
    payload,
    user: UserMetaData,
    queryRunner: QueryRunner
  ) {
    return await queryRunner.manager.save(BusinessEntity, {
      owner_id: user.userId,
      ...payload,
    });
  }
  async createAddress(address: AddressDto, business, queryRunner) {
    return await queryRunner.manager.save(BusinessAddressEntity, {
      ...address,
      business: business,
    });
  }
}
