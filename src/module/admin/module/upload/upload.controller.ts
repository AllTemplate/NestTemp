import { Body, ClassSerializerInterceptor, Controller, Post, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiExtraModels, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UploadMultipleFileDto, UploadSingleFileDto } from './upload.dto';
import { Express } from 'express';
import { FileValidationPipe } from './upload.validate.pipe';
import { ADMIN_API_GLOBAL_PREFIX } from '../../constant';

@Controller(`${ADMIN_API_GLOBAL_PREFIX}/upload`)
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('通用模块')
export class UploadController {
  constructor(private readonly uploadService: UploadService) { }

  @Post('/single')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: '单图片上传' })
  @ApiBody({
    description: 'Upload single files',
    type: UploadSingleFileDto,
    isArray: false,
  })
  @ApiBearerAuth()
  async uploadFile(@UploadedFile(FileValidationPipe) file: Express.Multer.File) {
    return await this.uploadService.singleUploadFile(file);
  }

  @Post('/multiple')
  @ApiExtraModels(UploadMultipleFileDto)
  @UseInterceptors(FilesInterceptor('files'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: '多图片上传' })
  @ApiBearerAuth()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  async multipleFile(@UploadedFiles(FileValidationPipe) files: Express.Multer.File[]) {
    return await this.uploadService.multipleLocalSave(files);
  }
}
