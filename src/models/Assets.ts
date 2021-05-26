import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("assets")
export default class Assets {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column()
  background: boolean;

  @Column()
  image: string;

  @Column()
  name: string;
}
