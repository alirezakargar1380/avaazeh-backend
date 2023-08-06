import { Package } from 'src/package/entitys/package.entity';
import { User } from 'src/users/entitys/users.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
export class Page {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.id, {
        onDelete: 'SET NULL'
    })
    @JoinColumn()
    user: User;

    @ManyToOne(() => User, user => user.id, {
        onDelete: 'SET NULL'
    })
    @JoinColumn()
    belongsTo: User;

    @ManyToOne(() => Package, pac => pac.id, {
        onDelete: 'SET NULL'
    })
    @JoinColumn()
    package: Package;

    @Column({ type: 'integer' })
    followersCount: number;

    @Column()
    engagementRate: string;
    
    @Column()
    subject: string;
    
    @Column()
    city: string;
    
    @Column()
    location: string;

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @DeleteDateColumn()
    deletedAt: Date
}