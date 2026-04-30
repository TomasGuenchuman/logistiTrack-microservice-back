import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'MICROSERVICIO - VERIFICATION SERVICE';
  }
}
