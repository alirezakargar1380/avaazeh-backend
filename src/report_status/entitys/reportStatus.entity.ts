import { Report } from 'src/report/entitys/report.entity';
import { User } from 'src/users/entitys/users.entity';
import { Entity, Column, JoinColumn, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

@Entity()
export class ReportStatus {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Report)
    @JoinColumn() 
    report: number;

    @ManyToOne(() => User)
    @JoinColumn() 
    reporter: number;

    @Column({ type: 'varchar', length: 225 })
    subject: string;

    @Column({ type: 'varchar', length: 1000 })
    description: string;

    @Column({ type: 'varchar', length: 30, nullable: true })
    date: string;

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @DeleteDateColumn()
    deletedAt: Date

}