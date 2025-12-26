import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AxiosResponse } from 'axios';
import { firstValueFrom, map, mergeMap } from 'rxjs';
import { SeriesMetadataEntity } from 'src/series/entities/series.entity';
import { Any, Repository } from 'typeorm';

@Injectable()
export class ReleasesService {
  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(SeriesMetadataEntity)
    private seriesMetadataRepository: Repository<SeriesMetadataEntity>,
  ) {}

  async getReleases(page: number): Promise<AxiosResponse<any[]>> {
    return firstValueFrom(
      this.httpService.get(
        `https://api.mangaupdates.com/v1/releases/days?page=${page}&include_metadata=true`,
      ),
    ).then(async (axiosResponse: AxiosResponse) => {
      const searchMetaMap = {};
      const response = axiosResponse.data;
      const ids = response.results.map((res) => res.metadata.series.series_id);

      const searchResult = await this.seriesMetadataRepository.findBy({
        seriesId: Any(ids),
      });

      searchResult.forEach((res) => {
        searchMetaMap[res.seriesId] = res;
      });

      const resultsWithMeta = response.results.map((res) => {
        return {
          metadata: res.metadata,
          record: {
            ...res.record,
            meta: searchMetaMap[res.metadata.series.series_id],
          },
        };
      });

      return { ...response, results: resultsWithMeta };
    });
  }
}
