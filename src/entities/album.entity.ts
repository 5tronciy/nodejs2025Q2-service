import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Artist } from './artist.entity';
import { Track } from './track.entity';
import { FavoriteAlbum } from './favorite-album.entity';

@Entity('albums')
export class Album {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  year: number;

  @Column({ nullable: true })
  artistId: string | null;

  @ManyToOne(() => Artist, (artist) => artist.albums, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'artistId' })
  artist: Artist | null;

  @OneToMany(() => Track, (track) => track.album)
  tracks: Track[];

  @OneToMany(() => FavoriteAlbum, (favorite) => favorite.album)
  favorites: FavoriteAlbum[];
}
