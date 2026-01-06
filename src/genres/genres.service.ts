import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
import { catchError, map } from 'rxjs';

@Injectable()
export class GenresService {
  constructor(private readonly httpService: HttpService) {}

  async getGenres(): Promise<any> {
    return this.httpService.get(`https://api.mangaupdates.com/v1/genres`).pipe(
      catchError((error) => {
        throw new HttpException(error.message, error.status);
      }),
      map((response) => response.data),
    );
  }
}
