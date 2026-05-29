import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { PackageService } from './package.service';
import { PackageController } from './package.controller';

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [PackageController],
  providers: [PackageService],
})
export class PackageModule {}
