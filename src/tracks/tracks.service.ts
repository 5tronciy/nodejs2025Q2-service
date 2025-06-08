import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from '../entities/track.entity';

@Injectable()
export class TracksService {
  constructor(
    @InjectRepository(Track)
    private readonly trackRepository: Repository<Track>,
  ) {}

  async create(createTrackDto: CreateTrackDto): Promise<Track> {
    const track = this.trackRepository.create({
      name: createTrackDto.name,
      artistId: createTrackDto.artistId || null,
      albumId: createTrackDto.albumId || null,
      duration: createTrackDto.duration,
    });

    return await this.trackRepository.save(track);
  }

  async findAll(): Promise<Track[]> {
    return await this.trackRepository.find();
  }

  async findOne(id: string): Promise<Track> {
    const track = await this.trackRepository.findOne({ where: { id } });
    if (!track) {
      throw new NotFoundException('Track not found');
    }
    return track;
  }

  async update(id: string, updateTrackDto: UpdateTrackDto): Promise<Track> {
    const track = await this.trackRepository.findOne({ where: { id } });
    if (!track) {
      throw new NotFoundException('Track not found');
    }

    track.name = updateTrackDto.name;
    track.artistId = updateTrackDto.artistId || null;
    track.albumId = updateTrackDto.albumId || null;
    track.duration = updateTrackDto.duration;

    return await this.trackRepository.save(track);
  }

  async remove(id: string): Promise<void> {
    const result = await this.trackRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Track not found');
    }
  }

  async removeArtistReferences(artistId: string): Promise<void> {
    await this.trackRepository.update({ artistId }, { artistId: null });
  }

  async removeAlbumReferences(albumId: string): Promise<void> {
    await this.trackRepository.update({ albumId }, { albumId: null });
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.trackRepository.count({ where: { id } });
    return count > 0;
  }
}
