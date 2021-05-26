import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("orders")
export default class Order {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column()
  userId: string;
  
  @Column()
  addressId: string;

  @Column()
  addressIdDelivery: string;

  @Column()
  productsIds: string;

  @Column()
  productsCreatedIds: string;
  
  @Column()
  subTotal: string;
  
  @Column()
  frete: string;

  @Column()
  total: string;

  @Column()
  status: string;

  @Column()
  statusColor: string;

  @Column()
  comments: string;
}
