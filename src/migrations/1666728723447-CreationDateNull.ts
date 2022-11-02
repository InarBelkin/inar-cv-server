import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreationDateNull1666728723447 implements MigrationInterface {
  name = 'CreationDateNull1666728723447';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "post" ALTER COLUMN "publicationDate" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "post" ALTER COLUMN "publicationDate" SET NOT NULL`,
    );
  }
}
