import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("transactions")
export default class Order {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column()
  userId: string;
  
  @Column()
  cartId: string;

  @Column()
  transactionId: string;

  @Column()
  status: string;

  @Column()
  authorizationCode: string;
  
  @Column()
  riskLevel: string;
  
  @Column()
  acquirerId: string;
}
