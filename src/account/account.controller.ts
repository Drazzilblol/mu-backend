import { Body, Controller, Get, Headers, Post, Put } from '@nestjs/common';
import { AccountService } from './account.service';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Put('login')
  async login(@Body() body: any) {
    return this.accountService.login(body);
  }

  @Put('loginWithCookie')
  async loginWithCookie(@Body() body: any) {
    return this.accountService.loginWithCookie(body);
  }

  @Post('logout')
  async logout(@Body() body: any, @Headers() headers: any) {
    return this.accountService.logout(body, headers);
  }

  @Get('profile')
  async getProfile(@Headers() headers: any) {
    return this.accountService.getProfile(headers);
  }

  @Get('refresh')
  async refresh(@Headers() headers: any) {
    return this.accountService.refresh(headers);
  }
}
