import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  login: string;

  @Column()
  password: string;

  @VersionColumn()
  version: number;

  @CreateDateColumn({
    type: 'bigint',
    transformer: { to: (value) => value, from: (value) => parseInt(value) },
  })
  createdAt: number;

  @UpdateDateColumn({
    type: 'bigint',
    transformer: { to: (value) => value, from: (value) => parseInt(value) },
  })
  updatedAt: number;
}
