import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
import { catchError, lastValueFrom, map, throwError } from 'rxjs';

@Injectable()
export class RequestService {
  constructor(private readonly httpService: HttpService) {}

  async request<T>(config) {
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
  }
}
