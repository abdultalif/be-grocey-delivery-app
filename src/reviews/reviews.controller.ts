import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { Auth } from 'src/common/decorators/auth.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { WebResponse } from 'src/common/types/web-response.type';
import { Users } from 'src/users/users.entity';
import { ReviewsService } from './reviews.service';

@Controller('/api/v1/reviews')
export class ReviewsController {
  constructor(private reviewsService: ReviewsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('User')
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createReview(
    @Auth() user: Users,
    @Body() request: any,
  ): Promise<WebResponse<any>> {
    const result = await this.reviewsService.createReview(user, request);
    return {
      message: 'Review created successfully',
      statusCode: HttpStatus.CREATED,
      data: result,
    };
  }

  @HttpCode(HttpStatus.OK)
  @Get(':productId')
  async getReviewsByProduct(
    @Param('productId', ParseUUIDPipe) productId: string,
  ): Promise<WebResponse<any>> {
    const result = await this.reviewsService.getReviewsByProduct(productId);
    return {
      //   message: `Data review produk: ${productName} berhasil diambil`,
      message: 'Data review berdasarkan produk berhasil diambil',
      statusCode: HttpStatus.OK,
      data: result,
    };
  }
  @HttpCode(HttpStatus.OK)
  @Get('')
  async getReviews(): Promise<WebResponse<any>> {
    const result = await this.reviewsService.getReviews();
    return {
      //   message: `Data review produk: ${productName} berhasil diambil`,
      message: 'Seluruh Data review berhasil diambil',
      statusCode: HttpStatus.OK,
      data: result,
    };
  }
}
