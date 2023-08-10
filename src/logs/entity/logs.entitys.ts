import { Role } from 'src/role/entitys/role.entity';
import { User } from 'src/users/entitys/users.entity';
import { Entity, Column, JoinColumn, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToOne } from 'typeorm';

@Entity()
export class Logs {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    action: string;

    @Column()
    title: string;

    @Column({
        nullable: true,
        default: null
    })
    ip: string;

    @ManyToOne(() => User, {
        onDelete: 'SET NULL',
        onUpdate: 'SET NULL',
        nullable: true,
        createForeignKeyConstraints: false
    })
    @JoinColumn()
    user: User

    @ManyToOne(() => Role, {
        onDelete: 'SET NULL',
        onUpdate: 'SET NULL',
        nullable: true,
        createForeignKeyConstraints: false
    })
    @JoinColumn()
    role: Role

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @DeleteDateColumn()
    deletedAt: Date
}