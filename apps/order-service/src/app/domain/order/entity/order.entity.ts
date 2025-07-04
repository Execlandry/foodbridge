import {
  BaseEntity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  Index,
} from "typeorm";
import { MenuItemBodyDto } from "../dto/order.dto";

@Entity("orders")
export class OrderEntity extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  public id!: string;

  @Column({ type: "varchar", select: true })
  public user_id!: string;

  @Column({ type: "jsonb", select: true })
  public business!: any;

  @Column({ type: "jsonb", select: true, default: null })
  public address!: any;

  @Column({ type: "boolean", default: false })
  public request_for_driver!: boolean;

  @Column({ type: "varchar", select: true})
  public amount!: string;

  @Column({ type: "varchar", length: 6, nullable: true })
  public otp?: string;

  //TODO::implement this for navigate pickup view
  @Column({ type: "boolean", default: false })
  public is_otp_verified?: string;

  @Column({ type: "jsonb", select: true, default: null })
  public menu_items!: MenuItemBodyDto[];

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
