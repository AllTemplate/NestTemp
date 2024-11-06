import { BusinessException } from '@/common/filter/result';
import { PipeTransform, Injectable } from '@nestjs/common';

@Injectable()
export class FileValidationPipe implements PipeTransform {
  transform(files: Express.Multer.File | Express.Multer.File[]) {
    if (Array.isArray(files) && files.length === 0) {
      throw new BusinessException('No files uploaded');
    }

    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    const validateFile = (file: Express.Multer.File) => {
      if (!allowedMimeTypes.includes(file.mimetype)) {
        throw new BusinessException(`图片类型不符合: ${allowedMimeTypes}`);
      }
      if (file.size > maxSize) {
        throw new BusinessException(`图片大小不能超过: ${maxSize}MB`);
      }
    };

    if (Array.isArray(files)) {
      files.forEach(validateFile);
    } else if (files) {
      validateFile(files);
    }

    return files;
  }
}
