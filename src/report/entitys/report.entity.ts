import { ContractRateBasics } from 'src/contract_rate_basics/entitys/ContractRateBasics.entity';
import { Project } from 'src/project/entitys/project.entity';
import { ProjectStatus } from 'src/project_status/entitys/project_status.entity';
import { ProjectType } from 'src/project_type/entitys/projectType.entity';
import { User } from 'src/users/entitys/users.entity';
import { Entity, Column, JoinColumn, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToOne, OneToMany } from 'typeorm';
import { ReportImages } from './report_images.entity';

@Entity()
export class Report {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User)
    @JoinColumn()
    creator: User

    @Column({ nullable: true })
    status: boolean;

    @ManyToOne(() => Project)
    @JoinColumn()
    project: Project;

    @ManyToOne(() => ProjectStatus, {
        onDelete: 'SET NULL'
    })
    @JoinColumn()
    projectStatus: ProjectStatus;

    @ManyToOne(() => ProjectType, {
        onDelete: 'SET NULL'
    })
    @JoinColumn()
    projectType: ProjectType;

    @OneToMany(type => ReportImages, reportImages => reportImages.report, {
        onDelete: 'NO ACTION'
    })
    @JoinColumn()
    reportImages: ReportImages[];

    @ManyToOne(() => ContractRateBasics, {
        onDelete: 'SET NULL'
    })
    @JoinColumn()
    contractRateBasics: ContractRateBasics;

    @Column()
    month: number;

    @Column()
    year: number;
    
    @Column()
    according_to_schedule: number;

    @Column()
    percentage_of_progress: number;

    @Column({ type: 'bigint', width: 200 })
    percentage_of_progress_in_amount: number;

    @Column({ type: 'varchar', length: 1000 })
    description: string;

    @Column({ type: 'date' })
    visit_date: Date;

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @DeleteDateColumn()
    deletedAt: Date
}