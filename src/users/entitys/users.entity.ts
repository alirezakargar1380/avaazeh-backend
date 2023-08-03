import { Organization } from 'src/organization/entitys/organization.entity';
import { Role } from 'src/role/entitys/role.entity';
import { Entity, Column, JoinColumn, PrimaryGeneratedColumn, OneToMany, ManyToOne, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToOne } from 'typeorm';

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        unique: true
    })
    username: string;

    @Column({
        nullable: true
    })
    email: string;

    @Column()
    fullName: string;

    @Column({
        default: false
    })
    active: boolean;

    @Column()
    phone: string;

    @ManyToOne(() => Role, {
        onDelete: 'SET NULL'
    })
    @JoinColumn()
    role: Role;

    @Column()
    month: number;

    @Column()
    year: number;

    @ManyToOne(() => Organization, { 
        onDelete: 'RESTRICT'
    })
    @JoinColumn()
    organization: Organization;

    @Column()
    password: string;

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @DeleteDateColumn()
    deletedAt: Date
}