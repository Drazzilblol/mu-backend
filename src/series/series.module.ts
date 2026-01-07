import { Module } from '@nestjs/common';
import { SeriesService } from './series.service';
import { SeriesController } from './series.controller';
import { HttpModule } from '@nestjs/axios';
import { SeriesMetadataModule } from 'src/series-metadata/series-metadata.module';

@Module({
  imports: [HttpModule, SeriesMetadataModule],
  controllers: [SeriesController],
  providers: [SeriesService],
})
export class SeriesModule {}
