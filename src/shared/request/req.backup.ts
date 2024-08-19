import { HttpService } from '@nestjs/axios';
import { Injectable, Inject, HttpException } from '@nestjs/common';
import { AxiosRequestConfig } from 'axios';
import { catchError, lastValueFrom, map, throwError } from 'rxjs';
import * as crypto from 'crypto';

export interface ServiceClientConfig {
  baseUrl: string;
  apiKey: string;
  secretKey: string;
}

@Injectable()
export class ServiceClient {
  constructor(
    private httpService: HttpService,
    @Inject('SERVICE_CONFIG') private config: ServiceClientConfig,
  ) {}

  async call<T>(method: string, endpoint: string, data?: any): Promise<T> {
    const url = `${this.config.baseUrl}${endpoint}`;
    const timestamp = Date.now().toString();
    const signature = this.generateSignature(method, endpoint, timestamp, data);

    const config: AxiosRequestConfig = {
      method,
      url,
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.config.apiKey,
        'x-signature': signature,
        'x-timestamp': timestamp,
      },
    };

    if (data) {
      if (method.toUpperCase() === 'GET') {
        config.params = data;
      } else {
        config.data = data;
      }
    }

    try {
      return await lastValueFrom(
        this.httpService.request<T>(config).pipe(
          map((response) => response.data),
          catchError((error) => {
            if (error.response) {
              return throwError(() => new HttpException(error.response.data, error.response.status));
            }
            return throwError(() => error);
          }),
        ),
      );
    } catch (error) {
      throw error;
    }
  }

  private generateSignature(method: string, endpoint: string, timestamp: string, data?: any): string {
    const payload = `${method.toUpperCase()}${endpoint}${timestamp}${JSON.stringify(data || '')}`;
    return crypto.createHmac('sha256', this.config.secretKey).update(payload).digest('hex');
  }
}
