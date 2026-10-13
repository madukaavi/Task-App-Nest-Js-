
import {
  IsBoolean,
  IsOptional,
  IsString,
  MaxLength,
  IsNotEmpty,
} from 'class-validator';

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @IsBoolean()
  completed?: boolean;
}
