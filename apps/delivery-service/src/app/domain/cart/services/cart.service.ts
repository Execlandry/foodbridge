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
  CreateCartMenuItemBodyDto,
  MenuItemBodyDto,
  UpdateCartMenuItemBodyDto,
} from "../dto/cart.dto";
import { UserMetaData } from "../../auth/guards/user";
import { EventEmitter2 } from "@nestjs/event-emitter";

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
    let createdRestaurant = null;
    console.log(payload);
    const { userId } = user;
    const { business_id } = payload;
    const existingCart = await this.cartRepo.findOne({
      where: {
        business_id,
        user_id: userId,
      },
    });
    let items: MenuItemBodyDto[] = [];
    if (existingCart) {
      items = existingCart.menu_items;
      items.push(payload.menu_item);
      return await existingCart.save();
    } else {
      items = [];
      items.push(payload.menu_item);
      return await this.cartRepo.save({
        user_id: user.userId,
        business_id: payload.business_id,
        menu_items: items,
      });
    }
  }

  async updateCartMenuItem(
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
      const updatedMenuItems = existingCart.menu_items.map((i) => {
        if (i.id === menu_item.id) {
          return payload.menu_item;
        }
        return i;
      });
      existingCart.menu_items = updatedMenuItems;
      return await existingCart.save();
    }
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
      const updatedMenuItems = existingCart.menu_items.filter(
        (i) => i.id !== menu_item.id
      );
      existingCart.menu_items = updatedMenuItems;
      return await existingCart.save();
    }
  }

  async listUserCart(user: UserMetaData) {
    const { userId } = user;
    return await this.cartRepo.findOne({
      where: {
        user_id: userId,
      },
    });
  }

  async clearCartMenuItem(user: UserMetaData) {
    const { userId } = user;
    const item = await this.cartRepo.findOne({
      where: {
        user_id: userId,
      },
    });
    await this.cartRepo.delete({ id: item.id });
    return null;
  }
}