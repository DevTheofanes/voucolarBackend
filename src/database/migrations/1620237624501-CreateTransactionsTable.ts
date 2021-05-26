import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateTransactionsTable1620237624501 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.createTable(
        new Table({
          name: "transactions",
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
              name:"transactionId",
              type:"varchar"
            },
            {
              name: "status",
              type: "varchar",
            },
            {
              name: "authorizationCode",
              type: "varchar",
            },
            {
              name: "riskLevel",
              type: "varchar",
            },
            {
              name: "acquirerId",
              type: "varchar",
            },
          ],
        })
      );
    }
  
    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropTable("transactions");
    }
}
  