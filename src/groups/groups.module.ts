import { Module } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [GroupsController],
  providers: [GroupsService],
})
export class GroupsModule {}
