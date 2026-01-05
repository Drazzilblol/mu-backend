import { Body, Controller, Post } from '@nestjs/common';
import { CategoriesService } from './categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post('search')
  searchCategories(@Body() body: any) {
    return this.categoriesService.searchCategories(body.query);
  }
}
