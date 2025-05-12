import {
  BaseEntity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("delivery")
export class DeliveryEntity extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  public id!: string;

  @Column({ type: "varchar", select: true })
  public order_id!: string;

  @Column({ type: "jsonb", select: true })
  public order!: any;

  @Column({ type: "boolean", select: true, default: false })
  public partner_assigned!: boolean;

  @Column({ type: "uuid", select: true, nullable: true })
  public delivery_partner_id!: string;

  @Column({ type: "jsonb", select: true, nullable: true })
  public delivery_partner!: any;

  @Column({ type: 'jsonb', nullable: true })
  public current_location?: { lat: number; lng: number };

  @Column({ 
    type: "varchar",
    default: 'pending',
    enum: ['in_transit', 'delivered']
  })
  public order_status: string;

  @CreateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  public created_at!: Date;

  @UpdateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  public updated_at!: Date;
}
