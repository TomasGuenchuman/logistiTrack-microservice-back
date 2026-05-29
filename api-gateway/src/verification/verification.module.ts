import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { VerificationService } from './verification.service';
import { VerificationController } from './verification.controller';

@Module({
  imports: [HttpModule],
  controllers: [VerificationController],
  providers: [VerificationService],
})
export class VerificationModule {}
