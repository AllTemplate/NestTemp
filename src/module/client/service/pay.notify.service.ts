import { BusinessException } from '@/common/filter/result';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { INotifyDecryptData, INotifyEncryptedData, IOrderDetail } from '@/service/wxRequest/wx.response.interface';
import { InjectRedis } from '@/plugin/redis';
import Redis from 'ioredis';

@Injectable()
export class WxPayNotifyService {
  private platformCertificatesSerialNoMap: Map<string, string>;
  private apiV3Key: string;
  @InjectRedis() private readonly redisClient: Redis;

  constructor(private readonly configService: ConfigService) {
    this.apiV3Key = configService.get('WxPay').apiV3Secret;
    this.platformCertificatesSerialNoMap = new Map();
  }

  async getCert(serial: string) {
    const certStr = await this.redisClient.get('WxPayPlatformCertificate');
    this.platformCertificatesSerialNoMap.set(serial, certStr);
  }

  async handlePaymentNotification(timestamp: string, nonce: string, signature: string, serial: string, body: INotifyEncryptedData): Promise<IOrderDetail> {
    await this.getCert(serial);
    if (!this.platformCertificatesSerialNoMap.has(serial)) {
      throw new BusinessException('未知的证书序列号');
    }

    this.checkTimestamp(timestamp);

    const message = [timestamp, nonce, JSON.stringify(body)].join('\n') + '\n';
    if (!this.verifySignature(message, signature, serial)) {
      throw new BusinessException('签名验证失败');
    }

    return this.decryptResource(body);
  }

  /**
   * @description 防止重放攻击
   * @param timestamp
   */
  private checkTimestamp(timestamp: string) {
    const now = Math.floor(Date.now() / 1000);
    const diff = Math.abs(now - parseInt(timestamp));
    if (diff > 60 * 5) throw new BusinessException('请求已过期');
  }

  /**
   * @description 验签
   * @param message
   * @param signature
   * @param serial
   * @returns
   */
  private verifySignature(message: string, signature: string, serial: string): boolean {
    const publicKey = this.platformCertificatesSerialNoMap.get(serial);
    const verifier = crypto.createVerify('RSA-SHA256');
    verifier.update(Buffer.from(message));
    return verifier.verify(publicKey, signature, 'base64');
  }

  /**
   * @description 解密数据
   * @param data
   * @returns
   */
  private decryptResource(data: { resource: { original_type: string; algorithm: string; ciphertext: string; associated_data: string; nonce: string } }): INotifyDecryptData {
    const { resource } = data;
    const { ciphertext, nonce, associated_data } = resource;
    const nonceBuffer = Buffer.from(nonce, 'utf8');
    const associatedDataBuffer = Buffer.from(associated_data, 'utf8');
    const cipherTextBuffer = Buffer.from(ciphertext, 'base64');

    const decipher = crypto.createDecipheriv('aes-256-gcm', this.apiV3Key, nonceBuffer);

    decipher.setAuthTag(cipherTextBuffer.subarray(-16));
    decipher.setAAD(associatedDataBuffer);

    const decrypted = Buffer.concat([decipher.update(cipherTextBuffer.subarray(0, -16)), decipher.final()]);
    const decryptedStr = decrypted.toString('utf8');
    return JSON.parse(decryptedStr);
  }
}
