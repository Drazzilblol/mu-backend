import { Module } from '@nestjs/common';
import { PublishersService } from './publishers.service';
import { PublishersController } from './publishers.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [PublishersController],
  providers: [PublishersService],
})
export class PublishersModule {}
