import {
  BaseEntity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToOne,
  ManyToOne,
} from "typeorm";
import { BusinessEntity } from "./business.entity";

@Entity("business_dishes")
export class BusinessDishEntity extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  public id!: string;

  @Column({ type: "varchar", length: 255, select: true })
  public name!: string;

  @Column({ type: "varchar", default: null })
  public description!: string;

  @Column({ type: "varchar", default: null })
  public category!: string;

  @Column({ type: "varchar", default: null })
  public food_type!: string;

  @Column({ type: "varchar", default: null })
  public meal_type!: string;

  @Column({ type: "varchar", default: null })
  public cuisine_type!: string;

  @Column({ type: "varchar", default: null })
  public ingredients!: string;

  @Column({ type: "varchar", default: null })
  public thumbnails!: string;

  @Column({ type: "integer" })
  public price!: number;

  @Column({ type: "integer", default: null })
  public delivery_time!: number;

  @Column({ type: "integer", default: null })
  public rating!: number;

  @ManyToOne(() => BusinessEntity, (event) => event.dishes)
  @JoinColumn({ name: "business_id", referencedColumnName: "id" })
  public business!: BusinessEntity;

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
