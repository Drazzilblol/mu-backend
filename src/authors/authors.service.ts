import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
import { catchError, map } from 'rxjs';

@Injectable()
export class AuthorsService {
  constructor(private httpService: HttpService) {}

  async searchAuthorSeries(body: any, id: string): Promise<any> {
    return this.httpService
      .post(`https://api.mangaupdates.com/v1/authors/${id}/series`, body)
      .pipe(
        catchError((error) => {
          throw new HttpException(error.message, error.status);
        }),
        map((response) => response.data),
      );
  }

  async getAuthor(id: string): Promise<any> {
    return this.httpService
      .get(`https://api.mangaupdates.com/v1/authors/${id}`)
      .pipe(
        catchError((error) => {
          throw new HttpException(error.message, error.status);
        }),
        map((response) => response.data),
      );
  }
}
