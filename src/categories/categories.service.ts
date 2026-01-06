import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
import { error } from 'console';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class CategoriesService {
  constructor(private readonly httpService: HttpService) {}

  async searchCategories(query: string): Promise<string[]> {
    return Promise.all([this.search(query), this.findCategoryByName(query)])
      .then(([searchResults, categories]) => {
        return Array.from(
          new Set([
            ...categories.data.map((item) => item.category),
            ...searchResults.data.results
              .map((item) => item.record.category)
              .filter((item: string) =>
                item.toLowerCase().includes(query.toLowerCase().trim()),
              ),
          ]),
        );
      })
      .catch((error) => {
        throw new HttpException(error.message, error.status);
      });
  }

  async findCategoryByName(query: string): Promise<any> {
    return firstValueFrom(
      this.httpService.post(
        `https://api.mangaupdates.com/v1/categories/findByPrefix`,
        { category: query },
      ),
    );
  }

  async search(query: string): Promise<any> {
    return firstValueFrom(
      this.httpService.post(
        `https://api.mangaupdates.com/v1/categories/search`,
        { search: query, perpage: 500 },
      ),
    );
  }
}
