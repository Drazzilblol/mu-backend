import { Module } from '@nestjs/common';
import { ListsService } from './lists.service';
import { ListsContrller } from './lists.controller';
import { HttpModule } from '@nestjs/axios';
import { SeriesMetadataModule } from 'src/series-metadata/series-metadata.module';

@Module({
  imports: [HttpModule, SeriesMetadataModule],
  controllers: [ListsContrller],
  providers: [ListsService],
})
export class ListsModule {}
