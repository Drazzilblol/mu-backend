import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ReleasesService } from './releases.service';

@Controller('releases')
export class ReleasesController {
  constructor(private readonly releasesService: ReleasesService) {}

  @Get('day')
  getDayReleases(@Query('page') page: number) {
    return this.releasesService.getReleases(page);
  }

  @Post('search')
  searchReleases(@Body() body: any) {
    return this.releasesService.searchReleases(body);
  }
}
