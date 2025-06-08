import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { User } from '../entities/user.entity';
import { Artist } from '../entities/artist.entity';
import { Album } from '../entities/album.entity';
import { Track } from '../entities/track.entity';
import { FavoriteArtist } from '../entities/favorite-artist.entity';
import { FavoriteAlbum } from '../entities/favorite-album.entity';
import { FavoriteTrack } from '../entities/favorite-track.entity';

config();

const configService = new ConfigService();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: configService.get('POSTGRES_HOST', 'localhost'),
  port: configService.get('POSTGRES_PORT', 5432),
  username: configService.get('POSTGRES_USER', 'postgres'),
  password: configService.get('POSTGRES_PASSWORD', 'password123'),
  database: configService.get('POSTGRES_DB', 'home_library'),
  synchronize: configService.get('TYPEORM_SYNCHRONIZE', 'false') === 'true',
  logging: configService.get('TYPEORM_LOGGING', 'false') === 'true',
  entities: [
    User,
    Artist,
    Album,
    Track,
    FavoriteArtist,
    FavoriteAlbum,
    FavoriteTrack,
  ],
  migrations: ['src/database/migrations/*.ts'],
  subscribers: ['src/database/subscribers/*.ts'],
});
