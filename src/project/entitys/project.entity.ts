import { City } from 'src/city/entitys/city.entity';
import { Organization } from 'src/organization/entitys/organization.entity';
import { ProjectStatus } from 'src/project_status/entitys/project_status.entity';
import { Uploader } from 'src/uploader/entitys/uploader.entity';
import { User } from 'src/users/entitys/users.entity';
import { Entity, Column, JoinColumn, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToOne } from 'typeorm';

@Entity()
export class Project {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        unique: true,
        nullable: true
    })
    project_code: string;

    @Column({
        unique: true
    })
    title: string;

    @Column()
    _constructor: string;

    @ManyToOne(() => City, {
        onDelete: 'SET NULL'
    })
    @JoinColumn()
    location: City; 

    @Column({ type: 'varchar', length: 1000 })
    x: string;

    @Column({ type: 'varchar', length: 1000 })
    y: string; 

    @Column({ type: 'varchar', length: 1000, nullable: true })
    description: string;

    @Column({ type: 'date' })
    start_date: Date;  

    @Column({ type: 'date' })
    end_date: Date;

    @ManyToOne(() => User) 
    @JoinColumn()
    creator: User 

    @ManyToOne(() => Uploader, {
        onDelete: 'SET NULL'
    }) 
    @JoinColumn()
    cover: Uploader 

    @ManyToOne(() => Organization, {
        onDelete: 'SET NULL'
    })
    @JoinColumn()
    executiveOrganization: Organization;

    @Column({ type: 'varchar', length: 225 })
    supervisoryOrganization: string;

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @DeleteDateColumn()
    deletedAt: Date
}