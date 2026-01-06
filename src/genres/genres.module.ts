import { Module } from '@nestjs/common';
import { GenresService } from './genres.service';
import { GenresController } from './genres.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [GenresController],
  providers: [GenresService],
})
export class GenresModule {}
