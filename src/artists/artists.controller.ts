import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { ArtistsService } from './artists.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { validate as isUUID } from 'uuid';

@Controller('artist')
export class ArtistsController {
  constructor(private readonly artistsService: ArtistsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createArtistDto: CreateArtistDto) {
    return await this.artistsService.create(createArtistDto);
  }

  @Get()
  async findAll() {
    return await this.artistsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException('Artist ID is invalid (not uuid)');
    }
    return await this.artistsService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateArtistDto: UpdateArtistDto,
  ) {
    if (!isUUID(id)) {
      throw new BadRequestException('Artist ID is invalid (not uuid)');
    }
    return await this.artistsService.update(id, updateArtistDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException('Artist ID is invalid (not uuid)');
    }
    await this.artistsService.remove(id);
  }
}
