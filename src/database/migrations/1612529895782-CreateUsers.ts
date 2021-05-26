import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class createUsers1607981150313 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "users",
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
            name: "avatar",
            type: "varchar",
            isNullable:true
          },
          {
            name: "manager",
            type: "boolean",
          },
          {
            name: "name",
            type: "varchar",
            isNullable:true,
          },
          {
            name: "email",
            type: "varchar",
            isUnique: true,
          },
          {
            name: "password",
            type: "varchar",
          }
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("users");
  }
}
