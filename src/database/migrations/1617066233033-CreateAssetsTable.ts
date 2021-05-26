import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateAssetsTable1617066233033 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "assets",
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
            name: "background",
            type: "boolean",
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
    await queryRunner.dropTable("assets");
  }
}
