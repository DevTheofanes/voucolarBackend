import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("products")
export default class Product {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column()
  categoryId: string;  

  @Column()
  image: string;

  @Column()
  name: string;

  @Column()
  value: string;

  @Column()
  valueNotDiscount: string;

  @Column()
  idsModelsWithoutCustomization: string;
}
