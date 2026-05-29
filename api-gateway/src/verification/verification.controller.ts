// src/verifications/verification.controller.ts

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

import { VerificationService } from './verification.service';
import { CreateVerificationDto } from './dto/create-verification.dto';
import { UpdateVerificationDto } from './dto/update-verification.dto';
import { UpdateVerificationStatusDto } from './dto/update-verification-status.dto';

@Controller('verifications')
export class VerificationController {
  constructor(private readonly verificationService: VerificationService) {}

  @Post()
  create(@Body() createVerificationDto: CreateVerificationDto) {
    return this.verificationService.create(createVerificationDto);
  }

  @Get()
  findAll() {
    return this.verificationService.findAll();
  }

  /**
   * Buscar verificaciones por orderId.
   *
   * Importante:
   * Este endpoint debe ir ANTES de @Get(':id'),
   * porque si no Nest podría interpretar "order" como si fuera un id.
   */
  @Get('order/:orderId')
  findByOrder(@Param('orderId', ParseUUIDPipe) orderId: string) {
    return this.verificationService.findByOrder(orderId);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.verificationService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateVerificationDto: UpdateVerificationDto,
  ) {
    return this.verificationService.update(id, updateVerificationDto);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateVerificationStatusDto: UpdateVerificationStatusDto,
  ) {
    return this.verificationService.updateStatus(
      id,
      updateVerificationStatusDto,
    );
  }

  /**
   * Endpoint de prueba.
   *
   * Reemite manualmente el evento delivery.verified desde Verification Service.
   *
   * Útil para:
   * - probar Redis
   * - probar si Package Service escucha el evento
   * - reenviar manualmente un evento perdido
   */
  @Post(':id/emit-delivery-verified')
  emitDeliveryVerified(@Param('id', ParseUUIDPipe) id: string) {
    return this.verificationService.emitDeliveryVerified(id);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.verificationService.remove(id);
  }
}
