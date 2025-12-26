import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';
import { SeriesMetadataEntity } from './entities/series.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SeriesService {
  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(SeriesMetadataEntity)
    private seriesMetadataRepository: Repository<SeriesMetadataEntity>,
  ) {}

  async getSeries(seriesId: string): Promise<AxiosResponse<any[]>> {
    return firstValueFrom(
      this.httpService.get(
        `https://api.mangaupdates.com/v1/series/${seriesId}`,
      ),
    ).then(async (axiosResponse: AxiosResponse) => {
      const response = axiosResponse.data;

      this.createOrUpdateMetadata([
        {
          seriesId: response.series_id,
          height: response.image.height,
          width: response.image.width,
          original: response.image.url.original,
          thumb: response.image.url.thumb,
          bayesian_rating: response.bayesian_rating || 0,
          type: response.type,
          year: response.year,
          title: response.title,
          genres: [...response.genres.map((genre) => genre.genre as string)],
        },
      ]);
      return response;
    });
  }

  private async createOrUpdateMetadata(values: any[]) {
    this.seriesMetadataRepository
      .createQueryBuilder()
      .insert()
      .into(SeriesMetadataEntity)
      .values(values)
      .orUpdate(
        [
          'height',
          'width',
          'original',
          'thumb',
          'bayesian_rating',
          'type',
          'year',
          'title',
          'genres',
        ],
        ['seriesId'],
        {
          skipUpdateIfNoValuesChanged: true,
        },
      )
      .execute();
  }

  async getSeriesMetadata(seriesId: string): Promise<AxiosResponse<any[]>> {
    return this.getSeries(seriesId);
  }

  async serachSeries(body: any): Promise<AxiosResponse<any[]>> {
    return firstValueFrom(
      this.httpService.post(
        `https://api.mangaupdates.com/v1/series/search`,
        body,
      ),
    )
      .then(async (axiosResponse: AxiosResponse) => {
        const response = axiosResponse.data;
        this.createOrUpdateMetadata(
          response.results.map((result) => {
            return {
              seriesId: result.record.series_id,
              height: result.record.image.height || 0,
              width: result.record.image.width || 0,
              original: result.record.image.url.original || '',
              thumb: result.record.image.url.thumb || '',
              bayesian_rating: result.record.bayesian_rating || 0,
              type: result.record.type,
              year: result.record.year,
              title: result.record.title,
              genres: [
                ...result.record.genres.map((genre) => genre.genre as string),
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
}
