import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Package } from './entities/package.entity';
import { PackagesService } from './package.service';
import { PackagesController } from './package.controller';
import { PackageEventsController } from './package-events.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Package])],
  controllers: [PackagesController, PackageEventsController],
  providers: [PackagesService],
  exports: [PackagesService],
})
export class PackagesModule {}
