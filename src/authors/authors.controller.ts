import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AuthorsService } from './authors.service';

@Controller('authors')
export class AuthorsController {
  constructor(private readonly authorsService: AuthorsService) {}

  @Post(':id/series')
  searchAuthorsSeries(@Body() body: any, @Param('id') id: string) {
    return this.authorsService.searchAuthorSeries(body, id);
  }

  @Get(':id')
  getAuthor(@Param('id') id: string) {
    return this.authorsService.getAuthor(id);
  }
}
