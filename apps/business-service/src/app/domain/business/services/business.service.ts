import {
  ConflictException,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
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
  SearchQueryDto,
  UpdateBusinessBodyDto,
  fetchBusinessByIdDto,
} from "../dto/business.dto";
import { BusinessAddressEntity } from "../entity/business.address.entity";
import { UserMetaData } from "../../auth/guards/user";
import { SearchService } from "../../search/search.service";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { groupBy } from "../../utility";

@Injectable()
export class BusinessService {
  constructor(
    private readonly logger: Logger,
    @InjectRepository(BusinessEntity)
    private businessRepo: Repository<BusinessEntity>,
    @InjectRepository(BusinessAddressEntity)
    private businessAddRepo: Repository<BusinessAddressEntity>,
    private readonly connection: Connection,
    private configService: ConfigService,
    private readonly searchService: SearchService,
    private eventEmitter: EventEmitter2
  ) {}

  public async search(searchParam: SearchQueryDto) {
    return await this.searchService.search(searchParam);
  }

  public async fetchAllMyBusiness() {
    return await this.businessRepo.find({
      relations: ["dishes"],
    });
  }

  public async fetchBusinessById(param: fetchBusinessByIdDto) {
    const { id } = param;
    const response = await this.businessRepo.findOne({
      where: { id },
      relations: ["dishes"],
    });
    const address = await this.businessAddRepo.findOne({
      where: { business: { id } },
    });
    const dishMenuItems = response.dishes;
    const categories = groupBy(dishMenuItems, "category");
    response.address = address;
    response.dishes = categories;
    return response;
  }

  async createBusiness(user: UserMetaData, payload: CreateBusinessBodyDto) {
    let createdBusiness = null;
    console.log(payload);
    const queryRunner = this.connection.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      createdBusiness = await this.createUserBusiness(
        payload,
        user,
        queryRunner
      );
      const address = await this.createAddress(
        payload.address,
        createdBusiness,
        queryRunner
      );
      this.eventEmitter.emit("index.business", {
        business: createdBusiness,
        address,
      });
      await queryRunner.commitTransaction();
      return createdBusiness;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async validateAuthorization(
    user: UserMetaData,
    param: fetchBusinessByIdDto
  ) {
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

  async updateBusiness(
    user: UserMetaData,
    payload: UpdateBusinessBodyDto,
    param: fetchBusinessByIdDto
  ) {
    const business = await this.validateAuthorization(user, param);
    try {
      await this.businessRepo.save({ ...business, payload });
    } catch (err) {
      throw err;
    }
  }
  async createUserBusiness(
    payload,
    user: UserMetaData,
    queryRunner: QueryRunner
  ) {
    return await queryRunner.manager.save(BusinessEntity, {
      owner_id: user.userId,
      ...payload,
    });
  }
  async createAddress(
    address: AddressDto,
    business,
    queryRunner
  ): Promise<BusinessAddressEntity> {
    return await queryRunner.manager.save(BusinessAddressEntity, {
      ...address,
      business: business,
    });
  }
}
