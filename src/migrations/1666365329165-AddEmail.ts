import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEmail1666365329165 implements MigrationInterface {
  name = 'AddEmail1666365329165';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "email" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "isActivated" boolean NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "activationCode" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "activationCode"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "isActivated"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "email"`);
  }
}
