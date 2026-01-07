import { Module } from '@nestjs/common';
import { ReleasesService } from './releases.service';
import { ReleasesController } from './releases.controller';
import { HttpModule } from '@nestjs/axios';
import { SeriesMetadataModule } from 'src/series-metadata/series-metadata.module';

@Module({
  imports: [HttpModule, SeriesMetadataModule],
  controllers: [ReleasesController],
  providers: [ReleasesService],
})
export class ReleasesModule {}
