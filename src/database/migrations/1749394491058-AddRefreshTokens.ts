import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRefreshTokens1749394491058 implements MigrationInterface {
  name = 'AddRefreshTokens1749394491058';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "refresh_tokens" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "token" character varying NOT NULL,
        "userId" uuid NOT NULL,
        "expiresAt" TIMESTAMP NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "isRevoked" boolean NOT NULL DEFAULT false,
        CONSTRAINT "PK_refresh_tokens_id" PRIMARY KEY ("id")
      )`,
    );

    await queryRunner.query(
      `ALTER TABLE "refresh_tokens" 
       ADD CONSTRAINT "FK_refresh_tokens_userId" 
       FOREIGN KEY ("userId") REFERENCES "users"("id") 
       ON DELETE CASCADE`,
    );

    await queryRunner.query(
      `CREATE INDEX "IDX_refresh_tokens_userId" ON "refresh_tokens" ("userId")`,
    );

    await queryRunner.query(
      `CREATE INDEX "IDX_refresh_tokens_token" ON "refresh_tokens" ("token")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "refresh_tokens" DROP CONSTRAINT "FK_refresh_tokens_userId"`,
    );
    await queryRunner.query(`DROP TABLE "refresh_tokens"`);
  }
}
