import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
import { catchError, map } from 'rxjs';

@Injectable()
export class PublishersService {
  constructor(private httpService: HttpService) {}

  async getPublisher(id: string): Promise<any> {
    return this.httpService
      .get(`https://api.mangaupdates.com/v1/publishers/${id}`)
      .pipe(
        catchError((error) => {
          throw new HttpException(error.message, error.status);
        }),
        map((response) => response.data),
      );
  }

  async getPublisherPublications(pubname: string): Promise<any> {
    return this.httpService
      .get(
        `https://api.mangaupdates.com/v1/publishers/publication?pubname=${pubname}`,
      )
      .pipe(
        catchError((error) => {
          throw new HttpException(error.message, error.status);
        }),
        map((response) => response.data),
      );
  }

  async getPublisherSeries(id: string): Promise<any> {
    return this.httpService
      .get(`https://api.mangaupdates.com/v1/publishers/${id}/series`)
      .pipe(
        catchError((error) => {
          throw new HttpException(error.message, error.status);
        }),
        map((response) => response.data),
      );
  }
}
