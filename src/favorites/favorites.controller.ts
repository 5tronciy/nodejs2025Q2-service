import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { validate as isUUID } from 'uuid';

@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  async findAll() {
    return await this.favoritesService.findAll();
  }

  @Post('track/:id')
  @HttpCode(HttpStatus.CREATED)
  async addTrack(@Param('id') id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException('Track ID is invalid (not uuid)');
    }
    await this.favoritesService.addTrack(id);
    return { message: 'Track added to favorites' };
  }

  @Delete('track/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeTrack(@Param('id') id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException('Track ID is invalid (not uuid)');
    }
    await this.favoritesService.removeTrack(id);
  }

  @Post('album/:id')
  @HttpCode(HttpStatus.CREATED)
  async addAlbum(@Param('id') id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException('Album ID is invalid (not uuid)');
    }
    await this.favoritesService.addAlbum(id);
    return { message: 'Album added to favorites' };
  }

  @Delete('album/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeAlbum(@Param('id') id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException('Album ID is invalid (not uuid)');
    }
    await this.favoritesService.removeAlbum(id);
  }

  @Post('artist/:id')
  @HttpCode(HttpStatus.CREATED)
  async addArtist(@Param('id') id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException('Artist ID is invalid (not uuid)');
    }
    await this.favoritesService.addArtist(id);
    return { message: 'Artist added to favorites' };
  }

  @Delete('artist/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeArtist(@Param('id') id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException('Artist ID is invalid (not uuid)');
    }
    await this.favoritesService.removeArtist(id);
  }
}
