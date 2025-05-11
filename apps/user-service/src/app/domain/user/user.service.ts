import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Like } from "typeorm";
import * as bcrypt from "bcrypt";

import { Logger } from "@fbe/logger";
import Stripe from "stripe";
import { ConfigService } from "@fbe/config";
import { UserRoles } from "@fbe/types";

import {
  DeliveryPartnerSignupDto,
  fieldsToUpdateDto,
  FindUserDto,
  FullPartnerDetailsDto,
  GetDeliveryPartnerAvailability,
  GetDeliveryPartnerbyId,
  PartnerResponseDto,
  UpdateUserByIdDto,
  UpdateUserPermissionBodyDto,
  UserSignupDto,
} from "./dto/user-request.dto";

import { UserEntity } from "./entity/user.entity";
import { DeliveryPartnerEntity } from "./entity/delivery-partner.entity";
import { AuthService } from "../auth/auth.service";

@Injectable()
export class UserService {
  private stripe: Stripe; // Declare stripe as a private property

  constructor(
    private readonly logger: Logger,
    private readonly authService: AuthService,
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
    @InjectRepository(DeliveryPartnerEntity)
    private partnerRepo: Repository<DeliveryPartnerEntity>,
    private configService: ConfigService
  ) {
    // Initialize Stripe in the constructor
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2023-08-16", // Use the correct Stripe API version
    });
  }

  async getAllUsers() {
    return this.userRepo.find({});
  }

  async update(
    email: string,
    fields: fieldsToUpdateDto
  ): Promise<UserEntity | undefined> {
    const existingUser = await this.findOneByEmail(email.toLowerCase());
    if (!existingUser) throw new NotFoundException();

    const fieldToUpdate: Partial<UserEntity> = {};

    if (fields.email) {
      const duplicateUser = await this.findOneByEmail(fields.email);
      if (duplicateUser && duplicateUser.id !== existingUser.id) {
        fields.email = undefined; // prevent duplicate email
      } else {
        fieldToUpdate.email = fields.email.toLowerCase();
      }
    }

    if (fields.password_update?.new_password) {
      const isValid = await this.authService.validateUserByPassword({
        email,
        password: fields.password_update.old_password,
      });
      if (isValid) {
        fieldToUpdate.password = await this.hashPassword(
          fields.password_update.new_password
        );
      } else {
        throw new BadRequestException("Invalid old password");
      }
    }

    for (const key in fields) {
      if (
        key !== "password_update" &&
        typeof fields[key] !== "undefined" &&
        fields[key] !== null
      ) {
        fieldToUpdate[key] = fields[key];
      }
    }

    const saveEntity = { ...existingUser, ...fieldToUpdate };
    await this.userRepo.save(saveEntity);

    return this.findOneByEmail(email);
  }

  async findOneByUserId(id: string): Promise<UserEntity | null> {
    return this.userRepo.findOne({ where: { id } });
  }

  async findOneByEmail(email: string): Promise<UserEntity | null> {
    return this.userRepo.findOne({ where: { email } });
  }

  async findUserByProperty(data: FindUserDto) {
    const { email, first_name, last_name, name } = data;
    return this.userRepo.find({
      where: [
        { name: Like(`%${name}%`) },
        { email: Like(`%${email}%`) },
        { first_name: Like(`%${first_name}%`) },
        { last_name: Like(`%${last_name}%`) },
      ],
    });
  }

  async registerDeliveryPartner(dto: DeliveryPartnerSignupDto) {
    const { email, password, name, mobno } = dto;

    // ✅ 1. Check if user already exists
    const existing = await this.userRepo.findOne({ where: { email } });
    if (existing) {
      throw new ConflictException("User already exists");
    }

    // ✅ 2. Hash the password
    const hashedPassword = await this.hashPassword(password);

    // ✅ 3. Create and save UserEntity
    const user = this.userRepo.create({
      email,
      password: hashedPassword,
      name,
      mobno,
      permissions: UserRoles["delivery-partner"],
    });

    await this.userRepo.save(user);

    // ✅ 4. Create Stripe connected account (Express type for testing)
    const account = await this.stripe.accounts.create({
      type: "express",
      email: "pednekarprashant399@gmail.com",
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    });

    console.log("Stripe account created:", account);

    // ✅ 5. Create and save DeliveryPartnerEntity
    const partner = this.partnerRepo.create({
      user,
      mobno,
      availability: true,
      stripe_id: account.id,
      onboarded: true, // Set to false for testing; set to true after onboarding
    });

    await this.partnerRepo.save(partner);

    // ✅ 6. Optionally return both user and partner info
    return {
      message: "Delivery partner registered successfully",
      partnerId: partner.id,
      stripeAccountId: account.id,
    };
  }

  async updatePartnerAvailability(
    param: GetDeliveryPartnerbyId,
    body: GetDeliveryPartnerAvailability
  ): Promise<PartnerResponseDto> {
    const { id } = param;
    const { availability } = body;

    const partner = await this.partnerRepo.findOne({
      where: {
        user: {
          id: id,
          permissions: UserRoles["delivery-partner"],
        },
      },
      relations: ["user"],
    });

    if (!partner) throw new NotFoundException();

    partner.availability = availability;
    await this.partnerRepo.save(partner);
    return {
      id: partner.id,
      email: partner.user.email,
      availability: partner.availability,
    };
  }

  async fetchRequestedPartnerDetails(
    param: GetDeliveryPartnerbyId
  ): Promise<FullPartnerDetailsDto> {
    const { id } = param;

    const partner = await this.partnerRepo.findOne({
      where: {
        user: {
          id: id,
          permissions: UserRoles["delivery-partner"],
        },
      },
      relations: ["user"],
    });

    if (!partner) {
      throw new NotFoundException("Partner not found");
    }

    return {
      // partnerId: partner.id,
      availability: partner.availability,
      ratings: partner.ratings,
      mobno: partner.mobno,
      created_at: partner.created_at,
      updated_at: partner.updated_at,
      user: {
        id: partner.user.id,
        email: partner.user.email,
        name: partner.user.name,
        permissions: partner.user.permissions,
      },
    };
  }

  async assignUserPermissions(
    param: UpdateUserByIdDto,
    payload: UpdateUserPermissionBodyDto
  ) {
    const { id } = param;
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException();

    user.permissions = payload.permissions;

    if (payload.permissions === UserRoles["delivery-partner"]) {
      const existingPartner = await this.partnerRepo.findOne({
        where: { user: { id: user.id } },
      });
      if (!existingPartner) {
        await this.partnerRepo.save({
          user,
          availability: true,
        });
      }
    }

    return this.userRepo.save(user);
  }

  async create(userInput: UserSignupDto): Promise<UserEntity> {
    const { email } = userInput;

    const existingUser = await this.findOneByEmail(email.toLowerCase());
    if (existingUser) {
      throw new ConflictException("User with email already exists");
    }

    const userEntity = this.userRepo.create();
    const hashedPassword = await this.hashPassword(userInput.password);

    const saveEntity = {
      ...userEntity,
      ...userInput,
      password: hashedPassword,
      first_name: userInput?.first_name?.toLowerCase(),
      last_name: userInput?.last_name?.toLowerCase(),
      picture_url: userInput?.picture_url,
      mobno: userInput?.mobno,
      name: userInput?.name,
      email: userInput?.email.toLowerCase(),
    };

    try {
      const user = await this.userRepo.save(saveEntity);
      this.logger.log(`User created: ${JSON.stringify(user)}`);
      return user;
    } catch (err) {
      this.logger.error(err);
      throw new ConflictException("User already exists with same email");
    }
  }

  async updateRefreshTokenByEmail(email: string, refToken: string) {
    const user = await this.findOneByEmail(email.toLowerCase());
    if (!user) throw new NotFoundException();

    const saveEntity = {
      ...user,
      refresh_token: refToken ? await this.hashData(refToken) : null,
    };

    return this.userRepo.save(saveEntity);
  }

  hashData(data: string) {
    return bcrypt.hash(data, 10);
  }

  async hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  }
}
