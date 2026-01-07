import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
import { catchError, map } from 'rxjs';
import { SeriesMetadataService } from 'src/series-metadata/series-metadata.service';

@Injectable()
export class AuthorsService {
  constructor(
    private httpService: HttpService,
    private seriesMetadataService: SeriesMetadataService,
  ) {}

  async searchAuthorSeries(body: any, id: string): Promise<any> {
    return this.httpService
      .post(`https://api.mangaupdates.com/v1/authors/${id}/series`, body)
      .pipe(
        catchError((error) => {
          throw new HttpException(error.message, error.status);
        }),
        map(async (result) => {
          const response = result.data;
          const ids = response.series_list.map((res) => res.series_id);

          const metadata =
            await this.seriesMetadataService.getMetadataByIds(ids);

          const resultsWithMeta = response.series_list.map((res) => {
            return {
              ...res,
              seriesMetadata: metadata[res.series_id],
            };
          });

          return { ...response, series_list: resultsWithMeta };
        }),
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
