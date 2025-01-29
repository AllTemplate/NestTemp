import { Injectable } from '@nestjs/common';
import { RequestService } from 'src/shared/request/request.service';
import { ICcertificates, ICode2sessionRes, IOrderDetail, IPayOrderRes, IQueryMchOderNo } from './wx.response.interface';
import { IGetCode2SessionReq, IReqPrePayOrderReq } from './wx.request.interface';

@Injectable()
export class WxRequestService {
  private readonly api_url = 'https://api.weixin.qq.com';
  private readonly api_mch_url = 'https://api.mch.weixin.qq.com';

  constructor(private readonly requestService: RequestService) {}

  /**
   * @description 获取用户openid
   * @param params
   * @returns
   */
  async getCode2Session(params: IGetCode2SessionReq): Promise<ICode2sessionRes> {
    return await this.requestService.request({
      url: `${this.api_url}/sns/jscode2session`,
      params,
    });
  }

  /**
   * @description 小程序下单
   * @param data
   * @param authorization
   * @returns
   */
  async reqWxPrePay(data: IReqPrePayOrderReq, authorization): Promise<IPayOrderRes> {
    return await this.requestService.request({
      url: `${this.api_mch_url}/v3/pay/transactions/jsapi`,
      method: 'post',
      data,
      headers: {
        authorization,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * @description 商户订单号查询
   * @param params
   * @returns
   */
  async getWxPayOrder(params: IQueryMchOderNo, authorization): Promise<IOrderDetail> {
    const { mchid, orderNo } = params;
    return await this.requestService.request({
      url: `${this.api_mch_url}/v3/pay/transactions/out-trade-no/${orderNo}`,
      params: { mchid },
      method: 'get',
      headers: {
        authorization,
        Accept: 'application/json',
      },
    });
  }

  /**
   * @description 获取平台证书
   * @param Authorization string
   * @returns
   */
  async getPlatformCertificate(Authorization: string): Promise<ICcertificates> {
    return await this.requestService.request({
      url: `${this.api_mch_url}/v3/certificates`,
      headers: {
        Authorization,
        Accept: 'application/json',
      },
    });
  }
}
