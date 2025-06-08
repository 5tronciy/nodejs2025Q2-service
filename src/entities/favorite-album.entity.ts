import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Album } from './album.entity';

@Entity('favorite_albums')
export class FavoriteAlbum {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  albumId: string;

  @ManyToOne(() => Album, (album) => album.favorites, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'albumId' })
  album: Album;

  @CreateDateColumn()
  createdAt: Date;
}
