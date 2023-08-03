import { Entity, Column, JoinColumn, PrimaryGeneratedColumn, OneToOne } from 'typeorm';

@Entity()
export class Uploader {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 1000 })
    link: string;
}