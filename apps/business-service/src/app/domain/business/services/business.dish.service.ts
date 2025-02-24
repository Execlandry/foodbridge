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
} from "../dto/business.dto";
import { BusinessAddressEntity } from "../entity/business.address.entity";
import { UserMetaData } from "../../auth/guards/user";
import { BusinessDishEntity } from "../entity/business.dish.entity";
import {
  createBusinessDishBodyDto,
  BusinessParamParamDto,
  UpdateDishItemParamDto,
  UpdateBusinessDishBodyDto,
} from "../dto/business.dish.dto";
import { EventEmitter2 } from "@nestjs/event-emitter";

@Injectable()
export class BusinessDishService {
  constructor(
    private readonly logger: Logger,
    private eventEmitter:EventEmitter2,
    @InjectRepository(BusinessEntity)
    private businessRepo: Repository<BusinessEntity>,
    @InjectRepository(BusinessDishEntity)
    private businessDishRepo: Repository<BusinessDishEntity>,
    private readonly connection: Connection,
    private configService: ConfigService
  ) {}

  async validateAuthorization(
    user: UserMetaData,
    param: BusinessParamParamDto
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
  async findDishById(id: string) {
    const dish = await this.businessDishRepo.findOne({
      where: { id },
    });
    if (!dish) {
      throw new NotFoundException(
        `business dish with this Id not found ${id}`
      );
    }
    return dish;
  }

  async createDish(
    user: UserMetaData,
    param: BusinessParamParamDto,
    payload: createBusinessDishBodyDto
  ) {
    const business = await this.validateAuthorization(user, param);
    const queryRunner = this.connection.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const dish = await this.createUserBusinessDish(
        payload,
        user,
        business,
        queryRunner
      );
      const menus = await this.businessDishRepo.find({where:{business:{id:business.id}}})
      if(menus && menus.length>0){
        const menuItems = menus.map(i=>i.name).join(',')
        this.eventEmitter.emit("index.dish.business",{business,menuItems});
      }
      await queryRunner.commitTransaction();
      return dish;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
  async updateDish(
    user: UserMetaData,
    param: UpdateDishItemParamDto,
    payload: UpdateBusinessDishBodyDto
  ) {
    const { dish_id, id } = param;

    await this.validateAuthorization(user, param);
    const dish = await this.findDishById(dish_id);
    return await this.businessDishRepo.save({
      id: dish.id,
      ...payload,
    });
  }
  async deleteDish(user: UserMetaData, param: UpdateDishItemParamDto) {
    const { dish_id, id } = param;

    await this.validateAuthorization(user, param);
    const dish = await this.findDishById(dish_id);
    await this.businessDishRepo.delete({
      id: dish.id,
    });
  }
  async createUserBusinessDish(
    payload,
    user: UserMetaData,
    business: BusinessEntity,
    queryRunner: QueryRunner
  ) {
    return await queryRunner.manager.save(BusinessDishEntity, {
      business: business,
      ...payload,
    });
  }

  async getAllDishByBusiness(
    user: UserMetaData,
    param: BusinessParamParamDto
  ) {
    const { id } = param;
    const business = await this.businessRepo.findOne({
      where: { id },
    });
    if (!business) {
      throw new NotFoundException(`business with this Id not found ${id}`);
    }
    const dishes = await this.businessDishRepo.find({
      where: {
        business: {
          id,
        },
      },
    });
    return {
      business,
      dishes,
    };
  }
}
