import { LoggerService } from '@/common/logger';
import { InjectRedis } from '@/plugin/redis';
import { WxRequestService } from '@/service/wxRequest/wx.request.service';
import { ICcertificatesData } from '@/service/wxRequest/wx.response.interface';
import { calcSign } from '@/utils';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, Timeout } from '@nestjs/schedule';
import * as crypto from 'crypto';
import * as uuid from 'uuid';
import Redis from 'ioredis';

@Injectable()
export class CertDecryptCertService {
  constructor(
    private readonly configService: ConfigService,
    private readonly wxRequestService: WxRequestService,
    private readonly loggerService: LoggerService,
    @InjectRedis()
    private readonly redisClient: Redis,
  ) { }

  @Timeout(1000)
  async initData() {
    await this.getEncryptedCertData();
  }

  @Cron('0 0 */10 * * *')
  async intervalGetData() {
    this.loggerService.info('10小时获取一次微信支付平台证书', '定时器');
    await this.getEncryptedCertData();
  }

  /**
   * @description 获取平台证书
   * @returns
   */
  async getEncryptedCertData() {
    const { mchid, privateKey, rsaSerialNo } = this.configService.get('WxPay');
    const timeStamp = Math.floor(Date.now() / 1000);
    const nonceStr = uuid.v4().replace(/-/g, '');
    const buildMessage = ['GET', '/v3/certificates', timeStamp, nonceStr, ''].join('\n') + '\n';
    const signature = calcSign(buildMessage, privateKey);
    const authorization =
      'WECHATPAY2-SHA256-RSA2048' + ' ' + `mchid="${mchid}",nonce_str="${nonceStr}",signature="${signature}",serial_no="${rsaSerialNo}",timestamp="${timeStamp}"`;
    const res = await this.wxRequestService.getPlatformCertificate(authorization);
    if (res.data.length > 0) {
      const certStr = this.decryptCertData(res.data[0]);
      return await this.saveCertData(certStr);
    }
  }

  /**
   * @description 解密证书数据
   * @param data
   * @returns
   */
  decryptCertData(data: ICcertificatesData): string {
    const { encrypt_certificate } = data;
    const { ciphertext, nonce, associated_data } = encrypt_certificate;
    const nonceBuffer = Buffer.from(nonce, 'utf8');
    const associatedDataBuffer = Buffer.from(associated_data, 'utf8');
    const cipherTextBuffer = Buffer.from(ciphertext, 'base64');
    const apiV3Key = this.configService.get('WxPay').apiV3Secret;

    const decipher = crypto.createDecipheriv('aes-256-gcm', apiV3Key, nonceBuffer);

    decipher.setAuthTag(cipherTextBuffer.subarray(-16));
    decipher.setAAD(associatedDataBuffer);

    const decrypted = Buffer.concat([decipher.update(cipherTextBuffer.subarray(0, -16)), decipher.final()]);
    const decryptedStr = decrypted.toString('utf8');
    return decryptedStr;
  }

  /**
   * @description 保存证书数据
   * @param cert
   * @returns
   */
  async saveCertData(cert: string): Promise<string> {
    return await this.redisClient.set('WxPayPlatformCertificate', cert);
  }
}
