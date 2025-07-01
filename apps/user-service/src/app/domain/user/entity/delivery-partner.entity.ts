import {
  BaseEntity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
  Index,
} from "typeorm";
import { UserEntity } from "./user.entity";

@Entity("delivery_partner")
export class DeliveryPartnerEntity extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  public id!: string;

  @Column({ type: "varchar", length: 500, nullable: true })
  public mobno!: string;

  @Index()
  @Column({ type: "boolean", default: true })
  public availability!: boolean;

  @Column({ type: "varchar", nullable: true })
  public ratings!: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  public stripe_id!: string;

  @Column({ type: "boolean", default: false })
  public onboarded!: boolean;

  @CreateDateColumn({
    type: "timestamptz",
    default: () => "CURRENT_TIMESTAMP",
    select: true,
  })
  public created_at!: Date;

  @OneToOne(() => UserEntity, (user) => user.partnerProfile)
  @JoinColumn()
  user: UserEntity;

  @UpdateDateColumn({
    type: "timestamptz",
    default: () => "CURRENT_TIMESTAMP",
    select: true,
  })
  public updated_at!: Date;
}
