import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AlbumsService } from '../albums/albums.service';
import { ArtistsService } from '../artists/artists.service';
import { Artist } from '../entities/artist.entity';
import { Album } from '../entities/album.entity';
import { FavoriteAlbum } from '../entities/favorite-album.entity';
import { FavoriteArtist } from '../entities/favorite-artist.entity';
import { FavoriteTrack } from '../entities/favorite-track.entity';
import { Track } from '../entities/track.entity';
import { TracksService } from '../tracks/tracks.service';
import { FavoritesResponse } from '../types/interfaces';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(FavoriteArtist)
    private readonly favoriteArtistRepository: Repository<FavoriteArtist>,
    @InjectRepository(FavoriteAlbum)
    private readonly favoriteAlbumRepository: Repository<FavoriteAlbum>,
    @InjectRepository(FavoriteTrack)
    private readonly favoriteTrackRepository: Repository<FavoriteTrack>,
    @InjectRepository(Artist)
    private readonly artistRepository: Repository<Artist>,
    @InjectRepository(Album)
    private readonly albumRepository: Repository<Album>,
    @InjectRepository(Track)
    private readonly trackRepository: Repository<Track>,
    @Inject(forwardRef(() => ArtistsService))
    private readonly artistsService: ArtistsService,
    @Inject(forwardRef(() => AlbumsService))
    private readonly albumsService: AlbumsService,
    @Inject(forwardRef(() => TracksService))
    private readonly tracksService: TracksService,
  ) {}

  async findAll(): Promise<FavoritesResponse> {
    const [favoriteArtists, favoriteAlbums, favoriteTracks] = await Promise.all(
      [
        this.favoriteArtistRepository.find({ relations: ['artist'] }),
        this.favoriteAlbumRepository.find({ relations: ['album'] }),
        this.favoriteTrackRepository.find({ relations: ['track'] }),
      ],
    );

    return {
      artists: favoriteArtists
        .map((favorite) => favorite.artist)
        .filter((artist) => artist !== null),
      albums: favoriteAlbums
        .map((favorite) => favorite.album)
        .filter((album) => album !== null),
      tracks: favoriteTracks
        .map((favorite) => favorite.track)
        .filter((track) => track !== null),
    };
  }

  async addTrack(id: string): Promise<void> {
    if (!(await this.tracksService.exists(id))) {
      throw new UnprocessableEntityException('Track not found');
    }

    const existingFavorite = await this.favoriteTrackRepository.findOne({
      where: { trackId: id },
    });

    if (!existingFavorite) {
      const favoriteTrack = this.favoriteTrackRepository.create({
        trackId: id,
      });
      await this.favoriteTrackRepository.save(favoriteTrack);
    }
  }

  async removeTrack(id: string): Promise<void> {
    const result = await this.favoriteTrackRepository.delete({ trackId: id });
    if (result.affected === 0) {
      throw new NotFoundException('Track is not in favorites');
    }
  }

  async addAlbum(id: string): Promise<void> {
    if (!(await this.albumsService.exists(id))) {
      throw new UnprocessableEntityException('Album not found');
    }

    const existingFavorite = await this.favoriteAlbumRepository.findOne({
      where: { albumId: id },
    });

    if (!existingFavorite) {
      const favoriteAlbum = this.favoriteAlbumRepository.create({
        albumId: id,
      });
      await this.favoriteAlbumRepository.save(favoriteAlbum);
    }
  }

  async removeAlbum(id: string): Promise<void> {
    const result = await this.favoriteAlbumRepository.delete({ albumId: id });
    if (result.affected === 0) {
      throw new NotFoundException('Album is not in favorites');
    }
  }

  async addArtist(id: string): Promise<void> {
    if (!(await this.artistsService.exists(id))) {
      throw new UnprocessableEntityException('Artist not found');
    }

    const existingFavorite = await this.favoriteArtistRepository.findOne({
      where: { artistId: id },
    });

    if (!existingFavorite) {
      const favoriteArtist = this.favoriteArtistRepository.create({
        artistId: id,
      });
      await this.favoriteArtistRepository.save(favoriteArtist);
    }
  }

  async removeArtist(id: string): Promise<void> {
    const result = await this.favoriteArtistRepository.delete({ artistId: id });
    if (result.affected === 0) {
      throw new NotFoundException('Artist is not in favorites');
    }
  }

  async removeArtistFromFavorites(artistId: string): Promise<void> {
    await this.favoriteArtistRepository.delete({ artistId });
  }

  async removeAlbumFromFavorites(albumId: string): Promise<void> {
    await this.favoriteAlbumRepository.delete({ albumId });
  }

  async removeTrackFromFavorites(trackId: string): Promise<void> {
    await this.favoriteTrackRepository.delete({ trackId });
  }
}
