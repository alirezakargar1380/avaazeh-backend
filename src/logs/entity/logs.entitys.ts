import { City } from 'src/city/entitys/city.entity';
import { Organization } from 'src/organization/entitys/organization.entity';
import { ProjectStatus } from 'src/project_status/entitys/project_status.entity';
import { Role } from 'src/role/entitys/role.entity';
import { Uploader } from 'src/uploader/entitys/uploader.entity';
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

    @Column()
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

    @ManyToOne(() => Organization, {
        onDelete: 'SET NULL',
        onUpdate: 'SET NULL',
        nullable: true,
        createForeignKeyConstraints: false
    }) 
    @JoinColumn()
    organization: Organization

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @DeleteDateColumn()
    deletedAt: Date
}