import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreationDate1666727681136 implements MigrationInterface {
  name = 'CreationDate1666727681136';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "date"`);
    await queryRunner.query(
      `ALTER TABLE "post" ADD "creationDate" TIMESTAMP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "post" ADD "publicationDate" TIMESTAMP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "publicationDate"`);
    await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "creationDate"`);
    await queryRunner.query(`ALTER TABLE "post" ADD "date" TIMESTAMP NOT NULL`);
  }
}
