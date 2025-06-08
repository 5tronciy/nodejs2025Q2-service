import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlbumsModule } from './albums/albums.module';
import { ArtistsModule } from './artists/artists.module';
import { getDatabaseConfig } from './database/database.config';
import { Album } from './entities/album.entity';
import { Artist } from './entities/artist.entity';
import { FavoriteAlbum } from './entities/favorite-album.entity';
import { FavoriteArtist } from './entities/favorite-artist.entity';
import { FavoriteTrack } from './entities/favorite-track.entity';
import { Track } from './entities/track.entity';
import { User } from './entities/user.entity';
import { FavoritesModule } from './favorites/favorites.module';
import { TracksModule } from './tracks/tracks.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: getDatabaseConfig,
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([
      User,
      Artist,
      Album,
      Track,
      FavoriteArtist,
      FavoriteAlbum,
      FavoriteTrack,
    ]),
    UsersModule,
    ArtistsModule,
    TracksModule,
    AlbumsModule,
    FavoritesModule,
  ],
})
export class AppModule {}
