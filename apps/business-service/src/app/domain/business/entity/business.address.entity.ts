import {
  BaseEntity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToOne,
} from "typeorm";
import { BusinessEntity } from "./business.entity";

@Entity("business_address")
export class BusinessAddressEntity extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  public id!: string;

  @Column({ type: "varchar", length: 255, select: true })
  public name!: string;

  @Column({ type: "varchar" })
  public city!: string;

  @Column({ type: "varchar" })
  public street!: string;

  @Column({ type: "varchar", length: 255 })
  public pincode!: string;

  @Column({ type: "varchar", length: 255 })
  public country!: string;

  @Column({ type: "varchar", length: 255 })
  public state!: string;

  @OneToOne(() => BusinessEntity)
  @JoinColumn({ name: "business_id", referencedColumnName: "id" })
  business: BusinessEntity;

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
}
