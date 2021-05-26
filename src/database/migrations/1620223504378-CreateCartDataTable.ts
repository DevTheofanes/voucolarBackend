import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateCartDataTable1620223504378 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.createTable(
        new Table({
          name: "cartData",
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
              name:"cartId",
              type:"varchar"
            },
            {
              name: "cartNumber",
              type: "varchar",
            },
            {
              name: "holderName",
              type: "varchar",
            },
            {
              name: "brand",
              type: "varchar",
            },
            {
              name: "street",
              type: "varchar",
            },
            {
              name: "streetNumber",
              type: "varchar",
            },
            {
              name: "neighborhood",
              type: "varchar",
            },
            {
              name: "city",
              type: "varchar",
            },
            {
              name: "state",
              type: "varchar",
            },
            {
              name: "zipcode",
              type: "varchar",
            },
            {
              name: "phone",
              type: "varchar",
            },
            {
              name: "cpf",
              type: "varchar",
            }
          ],
        })
      );
    }
  
    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropTable("cartData");
    }
}
  