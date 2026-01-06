import { Controller, Get, Param, Query } from '@nestjs/common';
import { PublishersService } from './publishers.service';

@Controller('publishers')
export class PublishersController {
  constructor(private readonly publishersService: PublishersService) {}

  @Get(':id')
  getPublisher(@Param('id') id: string) {
    return this.publishersService.getPublisher(id);
  }

  @Get('publication')
  getPublisherPublications(@Query('pubname') pubname: string) {
    return this.publishersService.getPublisherPublications(pubname);
  }

  @Get(':id/series')
  getPublisherSeries(@Param('id') id: string) {
    return this.publishersService.getPublisherSeries(id);
  }
}
