import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
import { catchError, map } from 'rxjs';

@Injectable()
export class GroupsService {
  constructor(private httpService: HttpService) {}

  async searchGroupSeries(id: string): Promise<any> {
    return this.httpService
      .get(`https://api.mangaupdates.com/v1/groups/${id}/series`)
      .pipe(
        catchError((error) => {
          throw new HttpException(error.message, error.status);
        }),
        map((response) => response.data),
      );
  }

  async getGroup(id: string): Promise<any> {
    return this.httpService
      .get(`https://api.mangaupdates.com/v1/groups/${id}`)
      .pipe(
        catchError((error) => {
          throw new HttpException(error.message, error.status);
        }),
        map((response) => response.data),
      );
  }
}
