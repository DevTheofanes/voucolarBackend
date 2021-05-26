
import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateProductsTable1617041824070 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "products",
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
            name: "categoryId",
            type: "varchar",
            isNullable:true,
          },
          {
            name: "image",
            type: "varchar",
            isNullable:true
          },
          {
            name: "name",
            type: "varchar",
          },
          {
            name:"value",
            type:"varchar"
          },
          {
            name:"valueNotDiscount",
            type:"varchar",
            isNullable: true,
          },
          {
            name:"idsModelsWithoutCustomization",
            type:"varchar",
            isNullable: true,
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("products");
  }
}
