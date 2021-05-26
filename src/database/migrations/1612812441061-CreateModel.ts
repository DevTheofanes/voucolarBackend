import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateModel1612812441061 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "models",
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
            name:"markId",
            type:"varchar"
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
          {
            name:"weight",
            type:"varchar",
            isNullable: true,
          },
          {
            name:"dimensions",
            type:"varchar",
            isNullable: true,
          },
          {
            name:"description",
            type:"varchar",
            isNullable: true,
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("models");
  }
}
