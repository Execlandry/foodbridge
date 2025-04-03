import {
  BaseEntity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
} from "typeorm";
import { BusinessDishEntity } from "./business.dish.entity";
import { BusinessAddressEntity } from "./business.address.entity";

@Entity("businesses")
export class BusinessEntity extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  public id!: string;

  @Column({ type: "varchar", length: 255, select: true })
  public name!: string;

  @Column({ type: "varchar", default: null })
  public description!: string;

  @Column({ type: "uuid" })
  public owner_id!: string;

  @Column({ type: "varchar", default: null })
  public website_url!: string;

  @Column({ type: "jsonb", default: null })
  public social_links!: any;

  @Column({ type: "varchar", default: null })
  public cuisine!: string;

  @Column({ type: "int", default: null })
  public average_price!: number;

  @Column({ type: "int", default: null })
  public average_rating!: number;

  @Column({ type: "varchar" })
  public latitude!: string;

  @Column({ type: "boolean", default: true })
  public is_available!: string;

  @Column({ type: "varchar" })
  public longitude!: string;

  @Column({ type: "varchar", default: null })
  public contact_no!: string;

  @Column({ type: "varchar", default: null })
  public banner!: string;

  @Column({ type: "varchar", default: null })
  public delivery_options!: string;

  @Column({ type: "varchar" })
  public pickup_options!: string;

  @Column({ type: "varchar" })
  public opens_at!: string;

  @Column({ type: "varchar" })
  public closes_at!: string;

  @OneToMany(() => BusinessDishEntity, (event) => event.business)
  public dishes!: BusinessDishEntity[];

  @OneToOne(() => BusinessAddressEntity)
  address: BusinessAddressEntity;

  @CreateDateColumn({
    type: "timestamptz",
    default: () => "CURRENT_TIMESTAMP",
    select: true,
  })
  public created_at!: Date;

  @UpdateDateColumn({
    type: "timestamptz",
    default: () => "CURRENT_TIMESTAMP",
    select: true,
  })
  public updated_at!: Date;

  @UpdateDateColumn({
    type: "timestamptz",
    default: () => "CURRENT_TIMESTAMP",
    select: true,
  })
  public deleted_at!: Date;
}
