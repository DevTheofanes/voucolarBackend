import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("models")
export default class Model {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column()
  markId: string;

  @Column()
  image: string;

  @Column()
  name: string;

  @Column()
  weight: string;

  @Column()
  dimensions: string;

  @Column()
  description: string;
}
