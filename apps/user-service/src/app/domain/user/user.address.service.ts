import { ConflictException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ConfigService } from "@fbe/config";
import { Logger } from "@fbe/logger";
import { Like, Repository } from "typeorm";
import * as bcrypt from "bcrypt";

import {
  CreateAddressDto,
  fieldsToUpdateDto,
  FindUserDto,
  UpdateUserByIdDto,
  UpdateUserPermissionBodyDto,
  UserSignupDto,
} from "./dto/user-request.dto";
import { UserEntity } from "./entity/user.entity";
import { AuthService } from "../auth/auth.service";
import { NotFoundException } from "@nestjs/common";
import { UserAddressEntity } from "./entity/user.address.entity";
import { UserMetaData } from "../auth/guards/user";
import { ApiBadRequestResponse } from "@nestjs/swagger";

@Injectable()
export class UserAddressService {
  constructor(
    private readonly logger: Logger,
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
    @InjectRepository(UserAddressEntity)
    private userAddressRepo: Repository<UserAddressEntity>
  ) {}

  async create(
    param:UpdateUserByIdDto,
    body: CreateAddressDto,
    apiUser: UserMetaData
  ): Promise<UserAddressEntity> {
    const user = await this.userRepo.findOne({ where: { id: param.id } });

    if (!user) {
      throw new NotFoundException(`user not found`);
    }

    const saveEntity = {
      ...body,
      user,
    };

    const existingAddress = await this.userAddressRepo.findOne({
      where: { user: { id: param.id } },
      relations: ['user'],
    });
  
    if (!existingAddress) {
      // Create new address
      const newAddress = this.userAddressRepo.create({
        ...body,
        user,
      });
  
      const createdAddress = await this.userAddressRepo.save(newAddress);
      this.logger.log(
        `Address created successfully: ${JSON.stringify(createdAddress)}`
      );
      return createdAddress;
    }
     else {
      existingAddress.city = body.city;
      existingAddress.lat = body.lat;
      existingAddress.long = body.long;
      existingAddress.country = body.country;
      existingAddress.street = body.street;
      existingAddress.state = body.state;
      existingAddress.name = body.name;
      existingAddress.pincode = body.pincode;
      this.userAddressRepo.merge(existingAddress, {
        ...body,
      });
      const updatedAddress = await this.userAddressRepo.save(existingAddress);

      this.logger.log(
        `address created successfully ${JSON.stringify(updatedAddress)}`
      );
      return updatedAddress;
    }
  }

  async fetchAllAddress(param:UpdateUserByIdDto,apiUser: UserMetaData) {
    return await this.userAddressRepo.find({
      where: {
        user: { id: param.id },
      },
    });
  }
}
