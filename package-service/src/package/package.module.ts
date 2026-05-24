import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Package } from './entities/package.entity';
import { PackagesService } from './package.service';
import { PackagesController } from './package.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Package])],
  controllers: [PackagesController],
  providers: [PackagesService],
  exports: [PackagesService],
})
export class PackagesModule {}
