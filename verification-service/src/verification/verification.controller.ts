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

import { VerificationsService } from './verification.service';
import { CreateVerificationDto } from './dto/create-verification.dto';
import { UpdateVerificationDto } from './dto/update-verification.dto';
import { UpdateVerificationStatusDto } from './dto/update-verification-status.dto';

@Controller('verifications')
export class VerificationsController {
  constructor(private readonly verificationsService: VerificationsService) {}

  @Post()
  create(@Body() createVerificationDto: CreateVerificationDto) {
    return this.verificationsService.create(createVerificationDto);
  }

  @Get()
  findAll() {
    return this.verificationsService.findAll();
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
    return this.verificationsService.findByOrder(orderId);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.verificationsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateVerificationDto: UpdateVerificationDto,
  ) {
    return this.verificationsService.update(id, updateVerificationDto);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateVerificationStatusDto: UpdateVerificationStatusDto,
  ) {
    return this.verificationsService.updateStatus(
      id,
      updateVerificationStatusDto.status,
    );
  }

  /**
   * IDELAMENTE NO DEBERÍA EXISTIR ESTE ENDPOINT.
   * Reemitir manualmente el evento delivery.verified.
   *
   * Útil para pruebas:
   * - si querés verificar Redis
   * - si querés probar si Package Service escucha bien
   * - si el evento se perdió porque Redis Pub/Sub no persiste mensajes
   */
  @Post(':id/emit-delivery-verified')
  async emitDeliveryVerified(@Param('id', ParseUUIDPipe) id: string) {
    const verification = await this.verificationsService.findOne(id);

    return this.verificationsService.emitDeliveryVerified(verification);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.verificationsService.remove(id);
  }
}
