import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class UpdateAlbumDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  year: number;

  @IsOptional()
  @IsString()
  artistId?: string | null;
}
