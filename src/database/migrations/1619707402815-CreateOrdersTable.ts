import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateOrdersTable1619707402815 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.createTable(
        new Table({
          name: "orders",
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
              name:"addressId",
              type:"varchar"
            },
            {
              name: "addressIdDelivery",
              type: "varchar",
            },
            {
              name: "productsIds",
              type: "varchar",
            },
            {
              name: "productsCreatedIds",
              type: "varchar",
            },
            {
              name: "subTotal",
              type: "varchar",
            },
            {
              name: "frete",
              type: "varchar",
            },
            {
              name: "total",
              type: "varchar",
            },
            {
              name: "status",
              type: "varchar",
            },
            {
              name: "statusColor",
              type: "varchar",
            },
            {
              name: "comments",
              type: "varchar",
            },
          ],
        })
      );
    }
  
    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropTable("orders");
    }
}
  