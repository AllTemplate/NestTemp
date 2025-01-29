export interface ICode2sessionRes {
  openid: string;
  session_key: string;
  unionid?: string;
  errmsg?: string;
  errcode?: string;
}

export interface IPayOrderRes {
  prepay_id: string;
}

export interface IQueryMchOderNo {
  mchid: string;
  orderNo: string;
}

export interface ICcertificatesData {
  effective_time: string;
  encrypt_certificate: {
    algorithm: string;
    associated_data: string;
    ciphertext: string;
    nonce: string;
  };
  expire_time: string;
  serial_no: string;
}

export interface ICcertificates {
  data: ICcertificatesData[];
}

export interface INotifyEncryptedData {
  id: string;
  create_time: string;
  resource_type: string;
  event_type: string;
  summary: string;
  resource: {
    original_type: string;
    algorithm: string;
    ciphertext: string;
    associated_data: string;
    nonce: string;
  };
}

export interface INotifyDecryptData {
  mchid: string;
  appid: string;
  out_trade_no: string;
  transaction_id: string;
  trade_type: string;
  trade_state: string;
  trade_state_desc: string;
  bank_type: string;
  attach: string;
  success_time: string;
  payer: { openid: string };
  amount: { total: number; payer_total: number; currency: string; payer_currency: string };
}

export interface IOrderDetail extends INotifyDecryptData {}
