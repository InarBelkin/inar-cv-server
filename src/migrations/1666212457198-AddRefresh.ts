import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRefresh1666212457198 implements MigrationInterface {
  name = 'AddRefresh1666212457198';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "refreshToken" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "refreshToken"`);
  }
}
