import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

@Entity()
export class Role {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        unique: true
    })
    title: string;

    @Column({
        default: false
    })
    isAdmin: boolean;

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @DeleteDateColumn()
    deletedAt: Date
}