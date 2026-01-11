import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
import e from 'express';
import { catchError, map } from 'rxjs';

@Injectable()
export class AccountService {
  constructor(private httpService: HttpService) {}

  async login(body: any) {
    return this.httpService
      .put(`https://api.mangaupdates.com/v1/account/login`, body)
      .pipe(
        catchError((error) => {
          throw new HttpException(error.response.data.reason, error.status);
        }),
        map((response) => response.data),
      );
  }

  async logout(body: any, headers: any) {
    return this.httpService
      .post(`https://api.mangaupdates.com/v1/account/logout`, body, {
        headers: { authorization: headers.authorization },
      })
      .pipe(
        catchError((error) => {
          throw new HttpException(error.message, error.status);
        }),
        map((response) => response.data),
      );
  }

  async refresh(headers: any) {
    return this.httpService
      .get(`https://api.mangaupdates.com/v1/account/refresh`, {
        headers: { authorization: headers.authorization },
      })
      .pipe(
        catchError((error) => {
          throw new HttpException(error.message, error.status);
        }),
        map((response) => {
          return {
            ...response.data,
            context: {
              ...response.data.context,
              session_token:
                response.headers['set-cookie']?.[0]
                  .split(';')[0]
                  .split('=')[1] || null,
            },
          };
        }),
      );
  }

  async getProfile(headers: any) {
    return this.httpService
      .get(`https://api.mangaupdates.com/v1/account/profile`, {
        headers: { authorization: headers.authorization },
      })
      .pipe(
        catchError((error) => {
          throw new HttpException(error.message, error.status);
        }),
        map((response) => response.data),
      );
  }

  async loginWithCookie(body: any) {
    return this.httpService
      .put(`https://api.mangaupdates.com/v1/account/loginWithCookie`, body)
      .pipe(
        catchError((error) => {
          throw new HttpException(error.message, error.status);
        }),
        map((response) => response.data),
      );
  }
}
