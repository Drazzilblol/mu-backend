import { Module } from '@nestjs/common';
import { AuthorsService } from './authors.service';
import { AuthorsController } from './authors.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [AuthorsController],
  providers: [AuthorsService],
})
export class AuthorsModule {}
