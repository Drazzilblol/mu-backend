import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SeriesMetadataEntity } from './entities/series.entity';
import { Any, Repository } from 'typeorm';
import { firstValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class SeriesMetadataService {
  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(SeriesMetadataEntity)
    private seriesMetadataRepository: Repository<SeriesMetadataEntity>,
  ) {}

  async createOrUpdateMetadata(values: any[]) {
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

  async getMetadataByIds(seriesIds: string[], needToFetchMissing = false) {
    const searchResult = await this.seriesMetadataRepository.findBy({
      series_id: Any(seriesIds),
    });

    const seriesMetaMap = {};
    searchResult.forEach((meta) => {
      seriesMetaMap[meta.series_id] = {
        ...meta,
        image: {
          url: {
            original: meta.original,
            thumb: meta.thumb,
          },
        },
        genres: meta.genres.map((genre) => ({ genre: genre })),
      };
      delete seriesMetaMap[meta.series_id].original;
      delete seriesMetaMap[meta.series_id].thumb;
    });

    if (!needToFetchMissing) {
      return seriesMetaMap;
    }

    const missingSeriesIds = seriesIds.filter((id) => {
      return !searchResult.some((meta) => meta.series_id === id);
    });

    const missingSeriesMetadata = await Promise.all(
      missingSeriesIds.map(async (id) => {
        return this.getSeriesMetadata(id.toString());
      }),
    );

    missingSeriesMetadata.forEach((meta) => {
      seriesMetaMap[meta.series_id] = {
        ...meta,
        image: {
          url: {
            original: meta.original,
            thumb: meta.thumb,
          },
        },
        genres: meta.genres.map((genre) => ({ genre: genre })),
      };
      delete seriesMetaMap[meta.series_id].original;
      delete seriesMetaMap[meta.series_id].thumb;
    });

    return seriesMetaMap;
  }

  async getSeriesMetadata(seriesId: string): Promise<any> {
    return firstValueFrom(
      this.httpService.get(
        `https://api.mangaupdates.com/v1/series/${seriesId}`,
      ),
    )
      .then(async (axiosResponse: AxiosResponse) => {
        const response = axiosResponse.data;

        const meta = {
          series_id: response.series_id,
          original: response.image.url.original || '',
          thumb: response.image.url.thumb || '',
          bayesian_rating: response.bayesian_rating || 0,
          type: response.type,
          year: response.year || '',
          title: response.title,
          genres: [...response.genres.map((genre) => genre.genre as string)],
        };

        this.createOrUpdateMetadata([meta]);
        return meta;
      })
      .catch((err) => {
        throw new HttpException(err.message, err.status);
      });
  }
}
