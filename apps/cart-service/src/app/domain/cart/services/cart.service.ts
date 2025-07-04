import {
  ConflictException,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ConfigService } from "@fbe/config";
import { Logger } from "@fbe/logger";
import { Like, Repository, Connection, QueryRunner } from "typeorm";

import { NotFoundException } from "@nestjs/common";
import { CartEntity } from "../entity/cart.entity";
import {
  CreateCartMenuItemBodyDto,
  MenuItemBodyDto,
  UpdateCartMenuItemBodyDto,
} from "../dto/cart.dto";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { UserMetaData } from "../../auth/guards/user";

@Injectable()
export class CartService {
  constructor(
    private readonly logger: Logger,
    @InjectRepository(CartEntity)
    private cartRepo: Repository<CartEntity>,
    private eventEmitter: EventEmitter2
  ) {}

  async createCartMenuItem(
    user: UserMetaData,
    payload: CreateCartMenuItemBodyDto
  ) {
    const { business_id } = payload;

    const existingCart = await this.cartRepo.findOne({
      where: {
        business_id,
        user_id: user.userId,
      },
    });
    let existingItems: MenuItemBodyDto[] = [];
    if (existingCart) {
      existingItems = existingCart.menu_items;
      // const isItemExists = existingItems.find(
      //   (i) => i.id === payload.menu_item.id
      // );
      // if (!isItemExists) {
      //   payload.menu_item.count = 1;
      //   existingItems.push(payload.menu_item);
      // } else {
      //   existingItems = existingItems.map((i) => {
      //     if (i.id === payload.menu_item.id) {
      //       i.count = i.count + 1;
      //       return i;
      //     }
      //     return i;
      //   });
      // }
      // existingCart.menu_items = existingItems;
      existingItems.push(payload.menu_item);
      await existingCart.save();
    } else {
      // payload.menu_item.count = 1;
      existingItems.push(payload.menu_item);
      await this.cartRepo.save({
        user_id: user.userId,
        business_id: business_id,
        menu_items: existingItems,
        business: payload.business,
      });
    }
    const FinalData = await this.cartRepo.find({
      where: {
        user_id: user.userId,
      },
    });
    return FinalData;
  }

  async deleteCartMenuItem(
    user: UserMetaData,
    payload: UpdateCartMenuItemBodyDto
  ) {
    const { userId } = user;
    const { business_id, menu_item } = payload;
    const existingCart = await this.cartRepo.findOne({
      where: {
        business_id,
        user_id: userId,
      },
    });
    if (!existingCart) {
      throw new NotFoundException();
    } else {
      existingCart.menu_items = existingCart.menu_items.filter(
        (item) => item.id !== menu_item.id
      );

      await existingCart.save();
    }
    const Newcart = await this.cartRepo.find({
      where: {
        user_id: userId,
      },
    });
    return Newcart;
  }

  async clearCartMenuItem(user: UserMetaData) {
    const { userId } = user;
    const items = await this.cartRepo.find({
      where: {
        user_id: userId,
      },
    });
    for (const item of items) await this.cartRepo.delete({ id: item.id });
    return null;
  }

  async listUserCart(user: UserMetaData) {
    const { userId } = user;
    return await this.cartRepo.find({
      where: {
        user_id: userId,
      },
    });
  }
}
