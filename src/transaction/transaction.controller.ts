import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Auth } from 'src/common/decorators/auth.decorator';
import { Users } from 'src/users/users.entity';
import { WebResponse } from 'src/common/types/web-response.type';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('/api/v1/transaction')
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('User')
  async createTransaction(
    @Auth() user: Users,
    @Body() request: any,
  ): Promise<WebResponse<any>> {
    const result = await this.transactionService.createTransaction(
      user,
      request,
    );

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Transaksi Berhasil ditambah',
      data: result,
    };
  }

  @Post('/midtrans_webhook')
  @HttpCode(HttpStatus.OK)
  async webHookMidtrans(
    @Auth() user: Users,
    @Body() request: any,
  ): Promise<WebResponse<any>> {
    const result = await this.transactionService.webHookMidtrans(user, request);

    return {
      statusCode: HttpStatus.OK,
      message: 'Midtrans webhook received',
      data: result,
    };
  }

  @Post('/cancel_transaction')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('User')
  @HttpCode(HttpStatus.OK)
  async cancelTransaction(
    @Auth() user: Users,
    @Body() request: any,
  ): Promise<WebResponse<any>> {
    const result = await this.transactionService.cancelTransaction(
      user,
      request,
    );

    return {
      statusCode: HttpStatus.OK,
      message: 'Membatalkan Transaksi berhasil',
      data: result,
    };
  }
}
