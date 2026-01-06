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
    return this.seriesService.searchSeries(body);
  }

  @Get(':id/groups')
  getSeriesGroups(@Param('id') id: string) {
    return this.seriesService.getSeriesGroups(id);
  }

  @Get(':id/ratingrainbow')
  getSeriesRatingRainbow(@Param('id') id: string) {
    return this.seriesService.getSeriesRatingRainbow(id);
  }

  @Post(':id/comments/search')
  searchSeriesComments(@Param('id') id: string, @Body() body: any) {
    return this.seriesService.searchSeriesComments(id, body);
  }
}
