import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';
import { SeriesMetadataEntity } from './entities/series.entity';
import { Any, Repository } from 'typeorm';
import { url } from 'inspector';

@Injectable()
export class SeriesService {
  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(SeriesMetadataEntity)
    private seriesMetadataRepository: Repository<SeriesMetadataEntity>,
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
    ).then(async (axiosResponse: AxiosResponse) => {
      const response = axiosResponse.data;

      this.createOrUpdateMetadata([
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
          'original',
          'thumb',
          'bayesian_rating',
          'type',
          'year',
          'title',
          'genres',
        ],
        ['series_id'],
        {
          skipUpdateIfNoValuesChanged: true,
        },
      )
      .execute();
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
        this.createOrUpdateMetadata(
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

  async getRelatedSeriesMetadata(response: any): Promise<any> {
    const ids = response.related_series.map((res) => res.related_series_id);

    const searchResult = await this.seriesMetadataRepository.findBy({
      series_id: Any(ids),
    });

    const missingSeriesIds = ids.filter((id) => {
      return !searchResult.some((meta) => +meta.series_id === id);
    });

    const missingSeriesMetadata = await Promise.all(
      missingSeriesIds.map(async (id) => {
        return this.getSeriesData(id.toString());
      }),
    );

    const searchMetaMap = {};
    searchResult.forEach((related) => {
      searchMetaMap[related.series_id] = {
        ...related,
        image: {
          url: {
            original: related.original,
            thumb: related.thumb,
          },
        },
        genres: related.genres.map((genre) => ({ genre: genre })),
      };
      delete searchMetaMap[related.series_id].original;
      delete searchMetaMap[related.series_id].thumb;
    });
    missingSeriesMetadata.forEach((related) => {
      searchMetaMap[related.series_id] = {
        series_id: related.series_id,
        image: {
          url: {
            original: related.image.url.original,
            thumb: related.image.url.thumb,
          },
        },
        bayesian_rating: related.bayesian_rating || 0,
        type: related.type,
        year: related.year,
        title: related.title,
        genres: related.genres,
      };
    });

    response.related_series = response.related_series.map((related) => {
      return {
        ...related,
        metadata: searchMetaMap[related.related_series_id] || {},
      };
    });

    return response;
  }
}
