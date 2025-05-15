// import { MenuItemBodyDto } from '../../../../../../order-service/src/app/domain/order/dto/order.dto';

import {
  BaseEntity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
} from "typeorm";

@Entity("payment")
export class PayoutEntity extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  public id!: string;

  @Column({ type: "varchar", select: true })
  public user_id!: string;

  @Column({ type: "uuid", select: true })
  public business_id!: string;

  @Column({ type: "uuid", select: true })
  public order_id!: string;

  @Column({ type: "varchar", default: "draft" })
  public status!: string;

  @Column({ type: "int", select: true })
  public amount!: number;

  @Column({ type: "jsonb", default: null })
  public menu_items!: any;

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
