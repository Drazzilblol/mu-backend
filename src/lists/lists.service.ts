import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable, Headers } from '@nestjs/common';
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
