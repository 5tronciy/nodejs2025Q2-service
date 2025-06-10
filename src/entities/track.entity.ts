import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Artist } from './artist.entity';
import { Album } from './album.entity';
import { FavoriteTrack } from './favorite-track.entity';

@Entity('tracks')
export class Track {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  artistId: string | null;

  @Column({ nullable: true })
  albumId: string | null;

  @Column()
  duration: number;

  @ManyToOne(() => Artist, (artist) => artist.tracks, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'artistId' })
  artist: Artist | null;

  @ManyToOne(() => Album, (album) => album.tracks, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'albumId' })
  album: Album | null;

  @OneToMany(() => FavoriteTrack, (favorite) => favorite.track)
  favorites: FavoriteTrack[];
}
