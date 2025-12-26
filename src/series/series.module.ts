import { Module } from '@nestjs/common';
import { SeriesService } from './series.service';
import { SeriesController } from './series.controller';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeriesEntity, SeriesMetadataEntity } from './entities/series.entity';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([SeriesEntity, SeriesMetadataEntity]),
  ],
  controllers: [SeriesController],
  providers: [SeriesService],
})
export class SeriesModule {}
