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
import { CartEntity } from "../entity/cart.entity";
import {
  AddressDto,
  CreateBusinessBodyDto,
  SearchQueryDto,
  UpdateBusinessBodyDto,
  fetchBusinessByIdDto,
} from "../dto/order.dto";
import { UserMetaData } from "../../auth/guards/user";
import { EventEmitter2 } from "@nestjs/event-emitter";

@Injectable()
export class CartService {
  constructor(
    private readonly logger: Logger,
    @InjectRepository(CartEntity)
    private cartRepo: Repository<CartEntity>,
    private readonly connection: Connection,
    private eventEmitter: EventEmitter2
  ) {}
  async createBusiness(user: UserMetaData, payload: CreateBusinessBodyDto) {
    let createdBusiness = null;
    console.log(payload);
    const queryRunner = this.connection.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      //const address = await this.createAddress(payload.address, createdBusiness, queryRunner);
      this.eventEmitter.emit("index.business", {
        business: createdBusiness,
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
}
