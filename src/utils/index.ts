import * as crypto from 'crypto';

export const calcSign = (buildMessage: string, privateKey: string): string => {
  const sign = crypto.createSign('SHA256');
  sign.update(buildMessage);
  const signature = sign.sign(privateKey, 'base64');
  return signature;
};
