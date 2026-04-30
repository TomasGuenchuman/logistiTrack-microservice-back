import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('packages')
export class Package {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  code!: string;

  @Column({ default: 'pending' })
  status!: string;
}
