import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRefreshNull1666213386043 implements MigrationInterface {
  name = 'AddRefreshNull1666213386043';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "refreshToken" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "refreshToken"`);
  }
}
