import { Role } from 'src/role/entitys/role.entity';
import { Entity, Column, JoinColumn, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToOne } from 'typeorm';

@Entity()
export class LogsAcc {

    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => Role, {
        onDelete: "SET NULL"
    })
    @JoinColumn()
    role: Role;

    @Column({
        default: false
    })
    get: boolean; 

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @DeleteDateColumn()
    deletedAt: Date
}