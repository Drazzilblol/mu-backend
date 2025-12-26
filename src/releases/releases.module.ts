import { Module } from '@nestjs/common';
import { ReleasesService } from './releases.service';
import { ReleasesController } from './releases.controller';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeriesMetadataEntity } from 'src/series/entities/series.entity';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([SeriesMetadataEntity])],
  controllers: [ReleasesController],
  providers: [ReleasesService],
})
export class ReleasesModule {}
