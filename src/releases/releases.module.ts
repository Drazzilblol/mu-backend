import { Module } from '@nestjs/common';
import { ReleasesService } from './releases.service';
import { ReleasesController } from './releases.controller';
import { HttpModule } from '@nestjs/axios';
import { SeriesMetadataModule } from 'src/series-metadata/series-metadata.module';
import { BookmarkEntity } from './entities/bookmark.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountModule } from 'src/account/account.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([BookmarkEntity]),
    HttpModule,
    SeriesMetadataModule,
    AccountModule,
  ],
  controllers: [ReleasesController],
  providers: [ReleasesService],
})
export class ReleasesModule {}
