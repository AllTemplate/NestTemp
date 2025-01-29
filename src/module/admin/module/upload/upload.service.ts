import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// import * as OSS from 'ali-oss';
import * as path from 'path';
import * as fs from 'fs';
import { randomUUID } from 'crypto';

@Injectable()
export class UploadService {
  // private readonly ossClient: OSS;
  constructor(private readonly configService: ConfigService) {
    // this.ossClient = new OSS(configService.get('OSS'));
  }

  async uploadFile(file: ParameterDecorator): Promise<string> {
    try {
      // const result = await this.ossClient.put(new Date().getTime(), file.toString());
      // return result.url;
      return '';
    } catch (error) {
      throw new Error(`Failed to upload file: ${error.message}`);
    }
  }

  async validateFolder(folder: string) {
    try {
      const stat = await fs.promises.stat(folder);
      await stat.isDirectory();
    } catch (error) {
      if (error.code === 'ENOENT' && error.errno === -4058) {
        await fs.promises.mkdir(folder);
      }
    }
  }

  async singleUploadFile(file: Express.Multer.File) {
    const folder = path.resolve(__dirname, '../../../../../file');
    await this.validateFolder(folder);
    const uuid = randomUUID();
    const type = path.extname(file.originalname);
    const filename = Date.now().toString() + '_' + uuid + '_' + type;
    const filepath = path.join(folder, filename);

    const promise = new Promise((resolve, reject) => {
      const writeStream = fs.createWriteStream(filepath);

      writeStream.write(file.buffer);
      writeStream.end();

      writeStream.on('finish', () => {
        resolve(`/file/${filename}`);
      });

      writeStream.on('error', (error) => {
        reject(error);
      });
    });
    const resFilePath = await promise.then((res) => res);
    return resFilePath;
  }

  async multipleLocalSave(files: Express.Multer.File[]) {
    const uploadPromises = files.map((file) => this.singleUploadFile(file));
    return Promise.all(uploadPromises);
  }
}
