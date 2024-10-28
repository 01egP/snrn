import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateFinancialEntities16222022030001730122178924 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'category',
                columns: [
                    {
                        name: 'id',
                        type: 'int',
                        isPrimary: true,
                        isGenerated: true,
                    },
                    {
                        name: 'name',
                        type: 'varchar',
                    },
                ],
            }),
        );

        await queryRunner.createTable(
            new Table({
                name: 'transaction',
                columns: [
                    {
                        name: 'id',
                        type: 'int',
                        isPrimary: true,
                        isGenerated: true,
                    },
                    {
                        name: 'amount',
                        type: 'decimal',
                        precision: 10,
                        scale: 2,
                    },
                    {
                        name: 'date',
                        type: 'date',
                    },
                    {
                        name: 'categoryId',
                        type: 'int',
                    },
                    {
                        name: 'type',
                        type: 'enum',
                        enum: ['income', 'expense'],
                    },
                    {
                        name: 'description',
                        type: 'varchar',
                    },
                ],
            }),
        );

        await queryRunner.createTable(
            new Table({
                name: 'budget',
                columns: [
                    {
                        name: 'id',
                        type: 'int',
                        isPrimary: true,
                        isGenerated: true,
                    },
                    {
                        name: 'categoryId',
                        type: 'int',
                    },
                    {
                        name: 'amount',
                        type: 'decimal',
                        precision: 10,
                        scale: 2,
                    },
                    {
                        name: 'month',
                        type: 'int',
                    },
                    {
                        name: 'year',
                        type: 'int',
                    },
                ],
            }),
        );

        await queryRunner.createForeignKey("transaction", new TableForeignKey({
            columnNames: ["categoryId"],
            referencedTableName: "category",
            referencedColumnNames: ["id"],
            onDelete: "CASCADE",
        }));

        await queryRunner.createForeignKey("budget", new TableForeignKey({
            columnNames: ["categoryId"],
            referencedTableName: "category",
            referencedColumnNames: ["id"],
            onDelete: "CASCADE", 
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('budget');
        await queryRunner.dropTable('transaction');
        await queryRunner.dropTable('category');
    }
}
