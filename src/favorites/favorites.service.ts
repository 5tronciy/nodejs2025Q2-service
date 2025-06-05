import { Injectable } from '@nestjs/common';
import { Favorites } from '../types/interfaces';

@Injectable()
export class FavoritesService {
  private favorites: Favorites[] = [];

  findAll(): Favorites[] {
    return this.favorites;
  }

  addTrack(id: string) {
    console.log(id);
    return null;
  }

  removeTrack(id: string) {
    console.log(id);
    return null;
  }

  addAlbum(id: string) {
    console.log(id);
    return null;
  }
}
