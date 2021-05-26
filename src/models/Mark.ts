import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("marks")
export default class Schedule {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column()
  image: string;

  @Column()
  name: string;
}
