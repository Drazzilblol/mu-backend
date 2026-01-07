import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { catchError, firstValueFrom, map } from 'rxjs';
import { SeriesMetadataService } from 'src/series-metadata/series-metadata.service';

@Injectable()
export class SeriesService {
  constructor(
    private readonly httpService: HttpService,
    private readonly seriesMetadataService: SeriesMetadataService,
  ) {}

  async getSeries(seriesId: string): Promise<any> {
    const response = await this.getSeriesData(seriesId);
    return this.getRelatedSeriesMetadata(response);
  }

  async getSeriesData(seriesId: string): Promise<any> {
    return firstValueFrom(
      this.httpService.get(
        `https://api.mangaupdates.com/v1/series/${seriesId}`,
      ),
    )
      .then(async (axiosResponse: AxiosResponse) => {
        const response = axiosResponse.data;

        this.seriesMetadataService.createOrUpdateMetadata([
          {
            series_id: response.series_id,
            original: response.image.url.original || '',
            thumb: response.image.url.thumb || '',
            bayesian_rating: response.bayesian_rating || 0,
            type: response.type,
            year: response.year || '',
            title: response.title,
            genres: [...response.genres.map((genre) => genre.genre as string)],
          },
        ]);
        return response;
      })
      .catch((err) => {
        throw new HttpException(err.message, err.status);
      });
  }

  async getSeriesMetadata(seriesId: string): Promise<any> {
    return this.getSeries(seriesId);
  }

  async searchSeries(body: any): Promise<any> {
    return firstValueFrom(
      this.httpService.post(
        `https://api.mangaupdates.com/v1/series/search`,
        body,
      ),
    )
      .then(async (axiosResponse: AxiosResponse) => {
        const response = axiosResponse.data;
        this.seriesMetadataService.createOrUpdateMetadata(
          response.results.map((result) => {
            return {
              series_id: result.record.series_id,
              original: result.record.image.url.original || '',
              thumb: result.record.image.url.thumb || '',
              bayesian_rating: result.record.bayesian_rating || 0,
              type: result.record.type,
              year: result.record.year || '',
              title: result.record.title,
              genres: [
                ...(result.record.genres?.map(
                  (genre) => genre.genre as string,
                ) || []),
              ],
            };
          }),
        );
        return response;
      })
      .catch((err) => {
        throw new HttpException(err.message, err.status);
      });
  }

  async getRelatedSeriesMetadata(response: any): Promise<any> {
    const ids = response.related_series.map((res) => res.related_series_id);

    const metadata = await this.seriesMetadataService.getMetadataByIds(
      ids,
      true,
    );

    response.related_series = response.related_series.map((related) => {
      return {
        ...related,
        metadata: metadata[related.related_series_id] || {},
      };
    });

    return response;
  }

  async getSeriesGroups(id: string): Promise<any> {
    return this.httpService
      .get(`https://api.mangaupdates.com/v1/series/${id}/groups`)
      .pipe(
        catchError((error) => {
          throw new HttpException(error.message, error.status);
        }),
        map((response) => response.data),
      );
  }

  async getSeriesRatingRainbow(id: string): Promise<any> {
    return this.httpService
      .get(`https://api.mangaupdates.com/v1/series/${id}/ratingrainbow`)
      .pipe(
        catchError((error) => {
          throw new HttpException(error.message, error.status);
        }),
        map((response) => response.data),
      );
  }

  async searchSeriesComments(id: string, body: any): Promise<any> {
    return this.httpService
      .post(
        `https://api.mangaupdates.com/v1/series/${id}/comments/search`,
        body,
      )
      .pipe(
        catchError((error) => {
          throw new HttpException(error.message, error.status);
        }),
        map((response) => response.data),
      );
  }
}
