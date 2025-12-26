import { Controller, Get, Query } from '@nestjs/common';
import { ReleasesService } from './releases.service';

@Controller('releases')
export class ReleasesController {
  constructor(private readonly releasesService: ReleasesService) {}

  @Get('day')
  getDayReleases(@Query('page') page: number) {
    return this.releasesService.getReleases(page);
  }
}
