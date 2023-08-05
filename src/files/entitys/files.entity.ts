import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

export enum file_type {
    FOLDER = 'folder',
    PICTURE = 'picture'
}

@Entity()
export class Files {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'enum',
        enum: file_type,
        default: file_type.FOLDER
    })
    type: file_type;

    @Column()
    name: string;

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @DeleteDateColumn()
    deletedAt: Date
}