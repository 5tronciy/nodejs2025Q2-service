import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlbumsModule } from '../albums/albums.module';
import { ArtistsModule } from '../artists/artists.module';
import { FavoritesController } from './favorites.controller';
import { FavoritesService } from './favorites.service';
import { TracksModule } from '../tracks/tracks.module';
import { Album } from 'src/entities/album.entity';
import { Artist } from 'src/entities/artist.entity';
import { FavoriteAlbum } from 'src/entities/favorite-album.entity';
import { FavoriteArtist } from 'src/entities/favorite-artist.entity';
import { FavoriteTrack } from 'src/entities/favorite-track.entity';
import { Track } from 'src/entities/track.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FavoriteArtist,
      FavoriteAlbum,
      FavoriteTrack,
      Artist,
      Album,
      Track,
    ]),
    forwardRef(() => ArtistsModule),
    forwardRef(() => AlbumsModule),
    forwardRef(() => TracksModule),
  ],
  controllers: [FavoritesController],
  providers: [FavoritesService],
  exports: [FavoritesService],
})
export class FavoritesModule {}
