import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum PackageStatus {
  PENDING = 'PENDING',
  IN_TRANSIT = 'IN_TRANSIT',
  DELIVERED = 'DELIVERED',
}

@Entity('packages')
export class Package {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    name: 'tracking_code',
    type: 'varchar',
    unique: true,
  })
  trackingCode!: string;

  @Column({
    name: 'recipient_name',
    type: 'varchar',
  })
  recipientName!: string;

  @Column({
    name: 'recipient_document',
    type: 'varchar',
  })
  recipientDocument!: string;

  @Column({
    type: 'varchar',
  })
  address!: string;

  @Column({
    type: 'enum',
    enum: PackageStatus,
    default: PackageStatus.PENDING,
  })
  status!: PackageStatus;

  @Column({
    name: 'courier_id',
    type: 'uuid',
  })
  courierId!: string;

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
