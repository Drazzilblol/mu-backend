import { Body, Controller, Get, Headers, Param, Post } from '@nestjs/common';
import { ListsService } from './lists.service';

@Controller('lists')
export class ListsContrller {
  constructor(private readonly listService: ListsService) {}
  @Get()
  async getProfile(@Headers() headers: any) {
    return this.listService.getLists(headers);
  }
  @Get('series/:id')
  async getSeriesList(@Headers() headers: any, @Param('id') id: string) {
    return this.listService.getSeriesList(id, headers);
  }
  @Post(':id/search')
  async searchList(
    @Headers() headers: any,
    @Body() body: any,
    @Param('id') id: string,
  ) {
    return this.listService.searchList(id, body, headers);
  }

  @Post('/series')
  async addSeriesToList(@Body() body: any, @Headers() headers: any) {
    return this.listService.addSeriesToList(body, headers);
  }

  @Post('/series/delete')
  async deleteSeriesFromList(@Body() body: any, @Headers() headers: any) {
    return this.listService.deleteSeriesFromList(body, headers);
  }

  @Post('/series/update')
  async updateSeriesList(@Body() body: any, @Headers() headers: any) {
    return this.listService.updateSeriesList(body, headers);
  }
}
