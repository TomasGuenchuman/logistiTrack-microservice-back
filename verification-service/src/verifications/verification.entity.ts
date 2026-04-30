import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('verifications')
export class Verification {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  packageId!: number;

  @Column({ default: 'verified' })
  result!: string;
}
