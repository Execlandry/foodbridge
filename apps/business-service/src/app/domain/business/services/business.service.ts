import { ConflictException, ForbiddenException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ConfigService } from "@fbe/config";
import { Logger } from "@fbe/logger";
import { Like, Repository, Connection, QueryRunner } from "typeorm";
import * as bcrypt from "bcrypt";

import { NotFoundException } from "@nestjs/common";
import { BusinessEntity } from "../entity/business.entity";
import {
  AddressDto,
  CreateBusinessBodyDto,
  fetchBusinessByIdDto,
  SearchQueryDto,
  UpdateBusinessBodyDto,
} from "../dto/business.dto";
import { BusinessAddressEntity } from "../entity/business.address.entity";
import { UserMetaData } from "../../auth/guards/user";
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SearchService } from "../../search/search.service";

@Injectable()
export class BusinessService {
  constructor(
    private readonly logger: Logger,
    @InjectRepository(BusinessEntity)
    private businessRepo: Repository<BusinessEntity>,
    private readonly connection: Connection,
    private configService: ConfigService,
    private readonly searchService: SearchService,
    private eventEmitter:EventEmitter2
  ) {}

  public async search(searchParam: SearchQueryDto) {
    return await this.searchService.search(searchParam);
  }

  public async fetchAllMyBusinesses(user:UserMetaData){
    const {userId}=user;
    return await this.businessRepo.find({where:{owner_id:userId},relations:['dishes']})

  }
  public async fetchBusinessById(param:fetchBusinessByIdDto){
    const{id}=param;
    return await this.businessRepo.find({where:{id},relations:['dishes']})

  }

  async createBusiness(user: UserMetaData, payload: CreateBusinessBodyDto) {
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
     const address= await this.createAddress(payload.address, createdBusiness, queryRunner);
      this.eventEmitter.emit("index.business",{
        business:createdBusiness,
        address

      })

      await queryRunner.commitTransaction();
      return createdBusiness;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async validateAuthorization(user:UserMetaData,param:fetchBusinessByIdDto){
    const { id } = param;
        const business = await this.businessRepo.findOne({
          where: { id },
        });
        if (!business) {
          throw new NotFoundException(`business with this Id not found ${id}`);
        }
        if (user.userId !== business.owner_id) {
          throw new ForbiddenException();
        }
        return business;

  }

  async updateBusiness(user: UserMetaData, payload: UpdateBusinessBodyDto,param:fetchBusinessByIdDto) {
    const business = await this.validateAuthorization(user,param);    
    try {
      await this.businessRepo.save({...business,payload})

      
      
    } catch (err) {
      throw err;
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
  async createAddress(address: AddressDto, business, queryRunner):Promise<BusinessAddressEntity> {
    return await queryRunner.manager.save(BusinessAddressEntity, {
      ...address,
      business: business,
    });
  }
}
