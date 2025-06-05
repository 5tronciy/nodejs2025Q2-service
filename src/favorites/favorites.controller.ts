import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  HttpStatus,
  HttpCode,
  BadRequestException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';

import { validate as isUuid } from 'uuid';
import { FavoritesService } from './favorites.service';

@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  async findAll() {
    return this.favoritesService.findAll();
  }

  @Post('track/:id')
  @HttpCode(HttpStatus.CREATED)
  async addTrack(@Param('id') id: string): Promise<{ message: string }> {
    if (!isUuid(id)) {
      throw new BadRequestException('Invalid track ID');
    }

    const result = await this.favoritesService.addTrack(id);
    if (result === 'not-found') {
      throw new UnprocessableEntityException(
        'Track with this id does not exist',
      );
    }

    return { message: 'Track added to favorites successfully' };
  }

  @Delete('track/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeTrack(@Param('id') id: string): Promise<void> {
    if (!isUuid(id)) {
      throw new BadRequestException('Invalid track ID');
    }

    const result = await this.favoritesService.removeTrack(id);
    if (!result) {
      throw new NotFoundException('Track is not in favorites');
    }
  }

  @Post('album/:id')
  @HttpCode(HttpStatus.CREATED)
  async addAlbum(@Param('id') id: string): Promise<{ message: string }> {
    if (!isUuid(id)) {
      throw new BadRequestException('Invalid album ID');
    }

    const result = await this.favoritesService.addAlbum(id);
    if (result === 'not-found') {
      throw new UnprocessableEntityException(
        'Album with this id does not exist',
      );
    }

    return { message: 'Album added to favorites successfully' };
  }
}
