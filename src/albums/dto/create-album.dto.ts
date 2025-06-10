import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateAlbumDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  year: number;

  @IsOptional()
  @IsString()
  artistId?: string | null;
}
