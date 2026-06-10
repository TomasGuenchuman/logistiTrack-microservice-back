import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { PackageService } from './package.service';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { UpdatePackageStatusDto } from './dto/update-package-status.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('packages')
export class PackageController {
  constructor(private readonly packageService: PackageService) {}

  @Post()
  create(@Body() createPackageDto: CreatePackageDto) {
    return this.packageService.create(createPackageDto);
  }

  @Get()
  findAll() {
    return this.packageService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.packageService.findOne(id);
  }

  @Get('tracking/:trackingCode')
  findByTrackingCode(@Param('trackingCode') trackingCode: string) {
    return this.packageService.findByTrackingCode(trackingCode);
  }

  @Get('courier/:courierId')
  findByCourierId(@Param('courierId', new ParseUUIDPipe()) courierId: string) {
    return this.packageService.findByCourierId(courierId);
  }

  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updatePackageDto: UpdatePackageDto,
  ) {
    return this.packageService.update(id, updatePackageDto);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updatePackageStatusDto: UpdatePackageStatusDto,
  ) {
    return this.packageService.updateStatus(id, updatePackageStatusDto);
  }

  @Patch(':id/delivered')
  markAsDelivered(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.packageService.markAsDelivered(id);
  }

  @Delete(':id')
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.packageService.remove(id);
  }
}
