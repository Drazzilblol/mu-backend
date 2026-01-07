import { Module } from '@nestjs/common';
import { SeriesMetadataService } from './series-metadata.service';
import { SeriesMetadataController } from './series-metadata.controller';
import { SeriesMetadataEntity } from './entities/series.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [TypeOrmModule.forFeature([SeriesMetadataEntity]), HttpModule],
  controllers: [SeriesMetadataController],
  providers: [SeriesMetadataService],
  exports: [SeriesMetadataService],
})
export class SeriesMetadataModule {}
