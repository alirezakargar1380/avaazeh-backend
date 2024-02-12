import { Role } from 'src/role/entitys/role.entity';
import { Entity, Column, JoinColumn, PrimaryGeneratedColumn, OneToMany, ManyToOne, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToOne } from 'typeorm';

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        nullable: true
    })
    email: string;

    @Column({
        default: ''
    })
    fullName: string;

    @Column({
        nullable: true,
        default: null
    })
    active: boolean;

    @Column({
        unique: true
    })
    phone: string;

    @ManyToOne(() => Role, {
        onDelete: 'SET NULL'
    })
    @JoinColumn()
    role: Role;

    @Column()
    month: number;

    @Column({
        default: null,
        nullable: true
    })
    telegram_chatId: string;

    @Column({
        default: 0
    })
    budget: number;

    @Column()
    year: number;

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @DeleteDateColumn()
    deletedAt: Date
}