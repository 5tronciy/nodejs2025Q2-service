import { IsString, IsNotEmpty, IsBoolean } from 'class-validator';

export class AddToFavoritesDto {
  @IsString()
  @IsNotEmpty()
  artists: string;

  @IsBoolean()
  grammy: boolean;
}
