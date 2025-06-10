import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Track } from './track.entity';

@Entity('favorite_tracks')
export class FavoriteTrack {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  trackId: string;

  @ManyToOne(() => Track, (track) => track.favorites, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'trackId' })
  track: Track;

  @CreateDateColumn()
  createdAt: Date;
}
