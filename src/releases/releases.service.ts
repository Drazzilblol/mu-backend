import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { catchError, firstValueFrom, from, map, of, switchMap } from 'rxjs';
import { SeriesMetadataService } from 'src/series-metadata/series-metadata.service';
import { BookmarkEntity } from './entities/bookmark.entity';
import { Any, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountService } from 'src/account/account.service';

@Injectable()
export class ReleasesService {
  constructor(
    private readonly httpService: HttpService,
    private readonly seriesMetadataService: SeriesMetadataService,
    @InjectRepository(BookmarkEntity)
    private bookmarkRepository: Repository<BookmarkEntity>,
    private readonly accountService: AccountService,
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

  async searchReleases(body: any, headers: any): Promise<any> {
    return this.httpService
      .post(`https://api.mangaupdates.com/v1/releases/search`, body)
      .pipe(
        catchError((error) => {
          throw new HttpException(error.message, error.status);
        }),
        switchMap((releases) =>
          from(this.accountService.getProfile(headers)).pipe(
            map((resp) => ({ profile: resp, releases: releases.data })),
            catchError(() => {
              return of({ releases: releases.data, profile: undefined });
            }),
          ),
        ),

        switchMap((response) => {
          return from(
            this.findBookmark(response.profile?.user_id, body.search),
          ).pipe(
            map((bookmarks) => ({
              bookmark: bookmarks?.[0],
              ...response.releases,
            })),
          );
        }),
        map((response) => {
          return response;
        }),
      );
  }

  async addBookmark(body: any): Promise<any> {
    return from(this.createOrUpdateBookmark(body)).pipe(
      catchError((error) => {
        throw new HttpException(error.message, error.status);
      }),
      map((results) => {
        return { ...body, bookmark_id: results.identifiers[0].bookmark_id };
      }),
    );
  }

  async createOrUpdateBookmark(body: any): Promise<any> {
    return this.bookmarkRepository
      .createQueryBuilder()
      .insert()
      .into(BookmarkEntity)
      .values([body])
      .orUpdate(['release_id', 'user_id', 'series_id'], ['bookmark_id'], {
        skipUpdateIfNoValuesChanged: true,
      })
      .execute();
  }

  async findBookmark(userId: string, seriesId: string): Promise<any> {
    if (!userId || !seriesId) return;
    return this.bookmarkRepository.findBy({
      series_id: String(seriesId),
      user_id: String(userId),
    });
  }
}
