import { Controller, Get, Header, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Header('Content-Type', 'application/json')
  getHello(@Res() res: Response): Response {
    return res.status(200).json({ sayHello: this.appService.getHello() });
  }
}
