import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello NestJS, I will become proficient in using you soon!';
  }
}
