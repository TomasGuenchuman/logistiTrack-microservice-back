import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum VerificationStatus {
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

@Entity('verifications')
export class Verification {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /**
   * Referencia lógica al paquete/order del Package Service.
   * No es FK real porque cada microservicio tiene su propia DB.
   */
  @Column({
    name: 'order_id',
    type: 'uuid',
    unique: true,
  })
  orderId!: string;

  /**
   * Hash del QR escaneado.
   * No conviene guardar necesariamente el QR crudo si podés guardar su hash.
   */
  @Column({
    name: 'qr_hash',
    type: 'varchar',
    length: 255,
  })
  qrHash!: string;

  /**
   * Firma digital.
   * Puede ser base64, SVG, JSON de trazos o una URL si después guardás el archivo aparte.
   */
  @Column({
    name: 'signature_data',
    type: 'text',
  })
  signatureData!: string;

  /**
   * Usuario/courier que realizó la verificación.
   * Referencia lógica al Auth Service.
   */
  @Column({
    name: 'verified_by',
    type: 'uuid',
  })
  verifiedBy!: string;

  @Column({
    type: 'enum',
    enum: VerificationStatus,
    default: VerificationStatus.SUCCESS,
  })
  status!: VerificationStatus;

  @Column({
    name: 'verified_at',
    type: 'timestamp',
    nullable: true,
  })
  verifiedAt!: Date | null;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
  })
  createdAt!: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
  })
  updatedAt!: Date;
}
