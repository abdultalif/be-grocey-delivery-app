import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Auth } from 'src/common/decorators/auth.decorator';
import { Users } from './users.entity';
import { WebResponse } from 'src/common/types/web-response.type';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { UsersService } from './users.service';
import { CurrentResponse, RequestChangePassword } from './users.dto';

@Controller('/api/v1/users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin', 'User')
  @Get('/current')
  async current(@Auth() user: Users): Promise<WebResponse<CurrentResponse>> {
    const result = await this.usersService.current(user);
    return {
      message: 'Data pengguna berhasil diambil',
      statusCode: HttpStatus.OK,
      data: result,
    };
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin', 'User')
  @Post('/change-password')
  async changePassword(
    @Auth() user: Users,
    @Body() request: RequestChangePassword,
  ): Promise<WebResponse<any>> {
    const result = await this.usersService.changePassword(user, request);
    return {
      message: 'Password berhasil diubah',
      statusCode: HttpStatus.OK,
      data: result,
    };
  }
}
