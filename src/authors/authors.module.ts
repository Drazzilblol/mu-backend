import { Module } from '@nestjs/common';
import { AuthorsService } from './authors.service';
import { AuthorsController } from './authors.controller';
import { HttpModule } from '@nestjs/axios';
import { SeriesMetadataModule } from 'src/series-metadata/series-metadata.module';

@Module({
  imports: [HttpModule, SeriesMetadataModule],
  controllers: [AuthorsController],
  providers: [AuthorsService],
})
export class AuthorsModule {}
