import { Entity, Column, JoinColumn, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToOne, OneToMany } from 'typeorm';
import { Project } from '../../project/entitys/project.entity';
import { FinancialCreditSources } from './../../financial-credit-sources/entitys/financial_credit_sources.entity';

@Entity()
export class FinancialCredit {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Project)
    @JoinColumn()
    project: Project;

    @ManyToOne(() => FinancialCreditSources)
    @JoinColumn() 
    source: FinancialCreditSources; 

    @Column()
    date: string;

    @Column({ type: 'bigint', width: 200 })
    amount: number;

    @Column()
    month: number;

    @Column()
    year: number;

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @DeleteDateColumn()
    deletedAt: Date
}