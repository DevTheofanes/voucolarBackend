import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("address")
export default class Address {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column()
  userId: string;
  
  @Column()
  name: string;

  @Column()
  surname: string;

  @Column()
  namefirm: string;
  
  @Column()
  cpf: string;
  
  @Column()
  cnpj: string;

  @Column()
  nation: string;
  
  @Column()
  cep: string;
  
  @Column()
  street: string;

  @Column()
  number: string;
  
  @Column()
  complement: string;
  
  @Column()
  neighborhood: string;

  @Column()
  state: string;
  
  @Column()
  phone: string;
}
