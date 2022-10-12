import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1665161856479 implements MigrationInterface {
  name = 'Migration1665161856479';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "post" ADD "date" TIMESTAMP NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "date"`);
  }
}
