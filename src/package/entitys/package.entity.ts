import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

@Entity()
export class Package {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        default: 0,
        type: 'integer'
    })
    price: number;

    @Column({
        default: 0,
        type: 'integer'
    })
    type: number;

    @Column()
    action: string;

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @DeleteDateColumn()
    deletedAt: Date
}