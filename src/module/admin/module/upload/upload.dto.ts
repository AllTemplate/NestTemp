import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export class UploadSingleFileDto {
  @ApiProperty({ description: '图片', required: true, type: 'string', format: 'binary' })
  file: Express.Multer.File;
}

export class UploadMultipleFileDto {
  @ApiProperty({ description: '图片', required: true, type: 'string', format: 'binary' })
  @IsArray()
  files: Express.Multer.File[];
}
