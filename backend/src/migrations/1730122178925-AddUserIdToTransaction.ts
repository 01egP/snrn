import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class AddUserIdToTransaction1730122178925 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'transaction',
      new TableColumn({
        name: 'userId',
        type: 'int',
        isNullable: false,
        default: 1,
      }),
    );

    await queryRunner.createForeignKey(
      'transaction',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedTableName: 'user',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('transaction');
    const foreignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('userId') !== -1,
    );

    if (foreignKey) {
      await queryRunner.dropForeignKey('transaction', foreignKey);
    }

    await queryRunner.dropColumn('transaction', 'userId');
  }
}
