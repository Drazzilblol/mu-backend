import { Body, Controller, Get, Headers, Param, Post } from '@nestjs/common';
import { ListsService } from './lists.service';

@Controller('lists')
export class ListsContrller {
  constructor(private readonly listService: ListsService) {}
  @Get()
  async getProfile(@Headers() headers: any) {
    return this.listService.getLists(headers);
  }
  @Post(':id/search')
  async searchList(
    @Headers() headers: any,
    @Body() body: any,
    @Param('id') id: string,
  ) {
    return this.listService.searchList(id, body, headers);
  }
}
