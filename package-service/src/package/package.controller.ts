import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';

import { PackagesService } from './package.service';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { UpdatePackageStatusDto } from './dto/update-package-status.dto';

@Controller('packages')
export class PackagesController {
  constructor(private readonly packagesService: PackagesService) {}

  @Post()
  create(@Body() createPackageDto: CreatePackageDto) {
    return this.packagesService.create(createPackageDto);
  }

  @Get()
  findAll() {
    return this.packagesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.packagesService.findOne(id);
  }

  @Get('tracking/:trackingCode')
  findByTrackingCode(@Param('trackingCode') trackingCode: string) {
    return this.packagesService.findByTrackingCode(trackingCode);
  }

  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updatePackageDto: UpdatePackageDto,
  ) {
    return this.packagesService.update(id, updatePackageDto);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updatePackageStatusDto: UpdatePackageStatusDto,
  ) {
    return this.packagesService.updateStatus(id, updatePackageStatusDto);
  }

  @Delete(':id')
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.packagesService.remove(id);
  }
}
