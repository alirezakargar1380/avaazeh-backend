import { Uploader } from 'src/uploader/entitys/uploader.entity';
import { Entity, Column, JoinColumn, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToOne, OneToMany } from 'typeorm';
import { Report } from './report.entity';

@Entity()
export class ReportImages {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Report, report => report.id, {
        onDelete: "NO ACTION"
    })
    @JoinColumn()
    report: Report

    @ManyToOne(() => Uploader, {
        onDelete: "NO ACTION"
    })
    @JoinColumn()
    image: Uploader

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @DeleteDateColumn()
    deletedAt: Date
}