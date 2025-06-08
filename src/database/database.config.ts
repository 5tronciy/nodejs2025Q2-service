import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Artist } from '../entities/artist.entity';
import { Album } from '../entities/album.entity';
import { Track } from '../entities/track.entity';
import { FavoriteArtist } from '../entities/favorite-artist.entity';
import { FavoriteAlbum } from '../entities/favorite-album.entity';
import { FavoriteTrack } from '../entities/favorite-track.entity';

export const getDatabaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get('POSTGRES_HOST', 'localhost'),
  port: configService.get('POSTGRES_PORT', 5432),
  username: configService.get('POSTGRES_USER', 'postgres'),
  password: configService.get('POSTGRES_PASSWORD', 'password123'),
  database: configService.get('POSTGRES_DB', 'home_library'),
  entities: [
    User,
    Artist,
    Album,
    Track,
    FavoriteArtist,
    FavoriteAlbum,
    FavoriteTrack,
  ],
  synchronize: configService.get('TYPEORM_SYNCHRONIZE', 'false') === 'true',
  logging: configService.get('TYPEORM_LOGGING', 'false') === 'true',
  migrationsRun: configService.get('TYPEORM_MIGRATIONS_RUN', 'true') === 'true',
  migrations: ['dist/database/migrations/*.js'],
  ssl:
    configService.get('NODE_ENV') === 'production'
      ? { rejectUnauthorized: false }
      : false,
});
