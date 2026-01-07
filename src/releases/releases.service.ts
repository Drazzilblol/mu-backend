import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { catchError, firstValueFrom, map, mergeMap } from 'rxjs';
import { SeriesMetadataService } from 'src/series-metadata/series-metadata.service';

@Injectable()
export class ReleasesService {
  constructor(
    private readonly httpService: HttpService,
    private readonly seriesMetadataService: SeriesMetadataService,
  ) {}

  async getReleases(page: number): Promise<AxiosResponse<any[]>> {
    return firstValueFrom(
      this.httpService.get(
        `https://api.mangaupdates.com/v1/releases/days?page=${page}&include_metadata=true`,
      ),
    )
      .then(async (axiosResponse: AxiosResponse) => {
        const response = axiosResponse.data;
        const ids = response.results.map(
          (res) => res.metadata.series.series_id,
        );

        const metadata = await this.seriesMetadataService.getMetadataByIds(ids);

        const resultsWithMeta = response.results.map((res) => {
          return {
            metadata: res.metadata,
            record: {
              ...res.record,
              metadata: metadata[res.metadata.series.series_id],
            },
          };
        });

        return { ...response, results: resultsWithMeta };
      })
      .catch((error) => {
        throw new HttpException(error.message, error.status);
      });
  }

  async searchReleases(body: any): Promise<any> {
    return this.httpService
      .post(`https://api.mangaupdates.com/v1/releases/search`, body)
      .pipe(
        catchError((error) => {
          throw new HttpException(error.message, error.status);
        }),
        map((response) => response.data),
      );
  }
}
