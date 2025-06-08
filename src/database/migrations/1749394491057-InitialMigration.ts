import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigrationWithCascade1749394491057
  implements MigrationInterface
{
  name = 'InitialMigrationWithCascade1749394491057';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "login" character varying NOT NULL,
        "password" character varying NOT NULL,
        "version" integer NOT NULL DEFAULT '1',
        "createdAt" bigint NOT NULL DEFAULT extract(epoch from now()) * 1000,
        "updatedAt" bigint NOT NULL DEFAULT extract(epoch from now()) * 1000,
        CONSTRAINT "UQ_users_login" UNIQUE ("login"),
        CONSTRAINT "PK_users_id" PRIMARY KEY ("id")
      )`,
    );

    await queryRunner.query(
      `CREATE TABLE "artists" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "grammy" boolean NOT NULL,
        CONSTRAINT "PK_artists_id" PRIMARY KEY ("id")
      )`,
    );

    await queryRunner.query(
      `CREATE TABLE "albums" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "year" integer NOT NULL,
        "artistId" uuid,
        CONSTRAINT "PK_albums_id" PRIMARY KEY ("id")
      )`,
    );

    await queryRunner.query(
      `CREATE TABLE "tracks" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "artistId" uuid,
        "albumId" uuid,
        "duration" integer NOT NULL,
        CONSTRAINT "PK_tracks_id" PRIMARY KEY ("id")
      )`,
    );

    await queryRunner.query(
      `CREATE TABLE "favorite_artists" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "artistId" uuid NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_favorite_artists_id" PRIMARY KEY ("id")
      )`,
    );

    await queryRunner.query(
      `CREATE TABLE "favorite_albums" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "albumId" uuid NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_favorite_albums_id" PRIMARY KEY ("id")
      )`,
    );

    await queryRunner.query(
      `CREATE TABLE "favorite_tracks" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "trackId" uuid NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_favorite_tracks_id" PRIMARY KEY ("id")
      )`,
    );

    await queryRunner.query(
      `ALTER TABLE "albums" 
       ADD CONSTRAINT "FK_albums_artistId" 
       FOREIGN KEY ("artistId") REFERENCES "artists"("id") 
       ON DELETE SET NULL`,
    );

    await queryRunner.query(
      `ALTER TABLE "tracks" 
       ADD CONSTRAINT "FK_tracks_artistId" 
       FOREIGN KEY ("artistId") REFERENCES "artists"("id") 
       ON DELETE SET NULL`,
    );

    await queryRunner.query(
      `ALTER TABLE "tracks" 
       ADD CONSTRAINT "FK_tracks_albumId" 
       FOREIGN KEY ("albumId") REFERENCES "albums"("id") 
       ON DELETE SET NULL`,
    );

    await queryRunner.query(
      `ALTER TABLE "favorite_artists" 
       ADD CONSTRAINT "FK_favorite_artists_artistId" 
       FOREIGN KEY ("artistId") REFERENCES "artists"("id") 
       ON DELETE CASCADE`,
    );

    await queryRunner.query(
      `ALTER TABLE "favorite_albums" 
       ADD CONSTRAINT "FK_favorite_albums_albumId" 
       FOREIGN KEY ("albumId") REFERENCES "albums"("id") 
       ON DELETE CASCADE`,
    );

    await queryRunner.query(
      `ALTER TABLE "favorite_tracks" 
       ADD CONSTRAINT "FK_favorite_tracks_trackId" 
       FOREIGN KEY ("trackId") REFERENCES "tracks"("id") 
       ON DELETE CASCADE`,
    );

    await queryRunner.query(
      `CREATE INDEX "IDX_albums_artistId" ON "albums" ("artistId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_tracks_artistId" ON "tracks" ("artistId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_tracks_albumId" ON "tracks" ("albumId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_favorite_artists_artistId" ON "favorite_artists" ("artistId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_favorite_albums_albumId" ON "favorite_albums" ("albumId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_favorite_tracks_trackId" ON "favorite_tracks" ("trackId")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "favorite_tracks" DROP CONSTRAINT "FK_favorite_tracks_trackId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "favorite_albums" DROP CONSTRAINT "FK_favorite_albums_albumId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "favorite_artists" DROP CONSTRAINT "FK_favorite_artists_artistId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tracks" DROP CONSTRAINT "FK_tracks_albumId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tracks" DROP CONSTRAINT "FK_tracks_artistId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "albums" DROP CONSTRAINT "FK_albums_artistId"`,
    );

    await queryRunner.query(`DROP TABLE "favorite_tracks"`);
    await queryRunner.query(`DROP TABLE "favorite_albums"`);
    await queryRunner.query(`DROP TABLE "favorite_artists"`);
    await queryRunner.query(`DROP TABLE "tracks"`);
    await queryRunner.query(`DROP TABLE "albums"`);
    await queryRunner.query(`DROP TABLE "artists"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
