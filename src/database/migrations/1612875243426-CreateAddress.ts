import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateAddress1612875243426 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "address",
        columns: [
          {
            name: "id",
            type: "integer",
            unsigned: true,
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name:"userId",
            type:"varchar"
          },
          {
            name: "name",
            type: "varchar",
          },
          {
            name: "surname",
            type: "varchar",
          },
          {
            name: "namefirm",
            type: "varchar",
            isNullable:true
          },
          {
            name: "cpf",
            type: "varchar",
            isNullable:true
          },
          {
            name: "cnpj",
            type: "varchar",
            isNullable:true
          },
          {
            name: "nation",
            type: "varchar",
          },
          {
            name: "cep",
            type: "varchar",
          },
          {
            name: "street",
            type: "varchar",
          },
          {
            name: "number",
            type: "varchar",
          },
          {
            name: "complement",
            type: "varchar",
            isNullable:true
          },
          {
            name: "neighborhood",
            type: "varchar",
            isNullable:true
          },
          {
            name: "state",
            type: "varchar",
          },
          {
            name: "phone",
            type: "varchar",
          },
          
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("address");
  }
}

