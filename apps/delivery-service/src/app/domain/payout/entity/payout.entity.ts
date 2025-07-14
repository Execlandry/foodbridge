import {
  BaseEntity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("payout")
export class PayoutEntity extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  public id!: string;

  @Column({ type: "uuid", select: true })
  public user_id!: string;

  @Column({ type: "uuid", select: true })
  public business_id!: string;

  @Column({ type: "uuid", select: true })
  public delivery_partner_id!: string;

  @Column({ type: "uuid", select: true })
  public order_id!: string;

  @Column({ type: "decimal", select: true })
  public amount!: number;

  @Column({ type: "varchar", select: true })
  public stripe_payment_intent_id!: string;

  @Column({ type: "decimal", select: true })
  public commission!: number;

  @Column({ type: "decimal", select: true })
  public net_amount!: number;

  @Column({
    type: "varchar",
    default: "pending",
    enum: ["pending", "success", "failed"], 
  })
  public payment_status!: string;

  @Column({
    type: "varchar",
    default: "card",
    enum: ["upi", "cod"],
  })
  public payment_method!: string;

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

  @DeleteDateColumn({
    type: "timestamptz",
    select: true,
  })
  public deleted_at!: Date | null;
}
