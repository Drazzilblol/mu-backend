import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { SeriesService } from './series.service';

@Controller('series')
export class SeriesController {
  constructor(private readonly seriesService: SeriesService) {}

  @Get(':id')
  getSeries(@Param('id') id: string) {
    return this.seriesService.getSeries(id);
  }

  @Get('metadata/:id')
  getSeriesImage(@Param('id') id: string) {
    return this.seriesService.getSeriesMetadata(id);
  }

  @Post('search')
  searchSeries(@Body() body: any) {
    return this.seriesService.serachSeries(body);
  }
}
