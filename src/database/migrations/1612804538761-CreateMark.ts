import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateMark1612804538761 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "marks",
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
            name: "image",
            type: "varchar",
            isNullable:true
          },
          {
            name: "name",
            type: "varchar",
            isNullable:true,
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("marks");
  }
}
