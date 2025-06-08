import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Artist } from './artist.entity';

@Entity('favorite_artists')
export class FavoriteArtist {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  artistId: string;

  @ManyToOne(() => Artist, (artist) => artist.favorites, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'artistId' })
  artist: Artist;

  @CreateDateColumn()
  createdAt: Date;
}
