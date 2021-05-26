import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("cartData")
export default class Order {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column()
  userId: string;
  
  @Column()
  cartId: string;

  @Column()
  cartNumber: string;

  @Column()
  holderName: string;

  @Column()
  brand: string;
  
  @Column()
  street: string;
  
  @Column()
  streetNumber: string;

  @Column()
  neighborhood: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  zipcode: string;

  @Column()
  phone: string;

  @Column()
  cpf: string;
}
