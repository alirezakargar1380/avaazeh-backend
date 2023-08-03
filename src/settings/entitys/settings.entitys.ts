import { Entity, Column, JoinColumn, PrimaryGeneratedColumn, OneToOne } from 'typeorm';

@Entity()
export class Settings {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'int', default: 1080 })
    quality: number;

    @Column({ type: 'int', default: 10 })
    max_number_of_report_image: number;

}