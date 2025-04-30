import {
  BaseEntity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
} from "typeorm";
import { MenuItemBodyDto } from "../dto/order.dto";

@Entity("orders")
export class OrderEntity extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  public id!: string;

  @Column({ type: "varchar", select: true })
  public user_id!: string;

  @Column({ type: "varchar", select: true,default:null })
  public driver_id!: string;

  @Column({ type: "jsonb", select: true, default: null })
  public driver!: any;

  // @Column({ type: "uuid", select: true })
  // public business_id!: string;

  @Column({ type: "jsonb", select: true })
  public business!: any;

  // @Column({ type: "uuid", select: true, default: null })
  // public address_id!: string;

  @Column({ type: "jsonb", select: true, default: null })
  public address!: any;

  @Column({ type: "boolean", default: false })
  public request_for_driver!: boolean;

  @Column({ type: "varchar", default: "draft",select:true })
  public payment_status!: string;

  @Column({ type: "varchar", default: "draft" ,select:true})
  public order_status!: string;

  @Column({ type: "varchar",select:true, default:0 })
  public amount!: string;

  @Column({ type: "jsonb",select:true, default: null })
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
