import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable, Headers, Body } from '@nestjs/common';
import { catchError, map } from 'rxjs';
import { SeriesMetadataService } from 'src/series-metadata/series-metadata.service';

@Injectable()
export class ListsService {
  constructor(
    private httpService: HttpService,
    private seriesMetadataService: SeriesMetadataService,
  ) {}

  async getLists(headers: any) {
    return this.httpService
      .get(`https://api.mangaupdates.com/v1/lists`, {
        headers: { authorization: headers.authorization },
      })
      .pipe(
        catchError((error) => {
          throw new HttpException(error.message, error.status);
        }),
        map((response) => response.data),
      );
  }

  async getSeriesList(seriesId: string, headers: any) {
    return this.httpService
      .get(`https://api.mangaupdates.com/v1/lists/series/${seriesId}`, {
        headers: { authorization: headers.authorization },
      })
      .pipe(
        catchError((error) => {
          throw new HttpException(error.message, error.status);
        }),
        map((response) => response.data),
      );
  }

  async addSeriesToList(body: any, headers: any) {
    console.log(body);
    return this.httpService
      .post(`https://api.mangaupdates.com/v1/lists/series`, body, {
        headers: { authorization: headers.authorization },
      })
      .pipe(
        catchError((error) => {
          throw new HttpException(error.message, error.status);
        }),
        map((response) => response.data),
      );
  }

  async deleteSeriesFromList(body: any, headers: any) {
    return this.httpService
      .post(`https://api.mangaupdates.com/v1/lists/series/delete`, body, {
        headers: { authorization: headers.authorization },
      })
      .pipe(
        catchError((error) => {
          throw new HttpException(error.message, error.status);
        }),
        map((response) => response.data),
      );
  }

  async updateSeriesList(body: any, headers: any) {
    console.log(body);
    return this.httpService
      .post(`https://api.mangaupdates.com/v1/lists/series/update`, body, {
        headers: { authorization: headers.authorization },
      })
      .pipe(
        catchError((error) => {
          throw new HttpException(error.message, error.status);
        }),
        map((response) => response.data),
      );
  }

  async searchList(id: string, body: any, headers: any) {
    return this.httpService
      .post(`https://api.mangaupdates.com/v1/lists/${id}/search`, body, {
        headers: { authorization: headers.authorization },
      })
      .pipe(
        catchError((error) => {
          throw new HttpException(error.message, error.status);
        }),
        map(async (result) => {
          const response = result.data;
          const ids = response.results.map((res) => res.record.series.id);

          const metadata =
            await this.seriesMetadataService.getMetadataByIds(ids);

          const resultsWithMeta = response.results.map((res) => {
            return {
              ...res,
              seriesMetadata: metadata[res.record.series.id],
            };
          });

          return { ...response, results: resultsWithMeta };
        }),
      );
  }
}
