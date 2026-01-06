import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { GroupsService } from './groups.service';

@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Get(':id/series')
  searchGroupSeries(@Param('id') id: string) {
    return this.groupsService.searchGroupSeries(id);
  }

  @Get(':id')
  getGroup(@Param('id') id: string) {
    return this.groupsService.getGroup(id);
  }
}
