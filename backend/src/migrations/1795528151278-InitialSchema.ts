import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Baseline schema generated from the current entities.
 * Replaces the earlier incremental migrations, which assumed tables created
 * by hand and could not run against an empty database.
 */
export class InitialSchema1795528151278 implements MigrationInterface {
  name = 'InitialSchema1795528151278';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`role\` varchar(255) NOT NULL DEFAULT 'user', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`transaction\` (\`id\` int NOT NULL AUTO_INCREMENT, \`amount\` decimal(10,2) NOT NULL, \`date\` datetime NOT NULL, \`categoryId\` int NOT NULL, \`type\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL, \`latitude\` decimal(9,6) NULL, \`longitude\` decimal(9,6) NULL, \`userId\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`category\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`budget\` (\`id\` int NOT NULL AUTO_INCREMENT, \`categoryId\` int NOT NULL, \`amount\` decimal(10,2) NOT NULL, \`month\` int NOT NULL, \`year\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );

    // Default categories shared by all users
    await queryRunner.query(
      `INSERT INTO \`category\` (\`name\`) VALUES ('Food'), ('Transport'), ('Entertainment'), ('Housing'), ('Health'), ('Savings')`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`budget\``);
    await queryRunner.query(`DROP TABLE \`category\``);
    await queryRunner.query(`DROP TABLE \`transaction\``);
    await queryRunner.query(`DROP TABLE \`user\``);
  }
}
