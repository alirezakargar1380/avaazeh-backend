import { Package } from 'src/package/entitys/package.entity';
import { PagePackage } from 'src/page_packages/entitys/page_package.entity';
import { User } from 'src/users/entitys/users.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class Page {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.id, {
        onDelete: 'SET NULL'
    })
    @JoinColumn()
    user: User;

    // @ManyToOne(() => User, user => user.id, {
    //     onDelete: 'SET NULL'
    // })
    // @JoinColumn()
    // belongsTo: User;

    @OneToMany(() => PagePackage, pac => pac.page)
    packages: PagePackage[];

    @Column({ type: 'integer' })
    followersCount: number;

    @Column({ default: null, nullable: true, unique: true })
    username: string;

    @Column()
    engagementRate: string;
    
    @Column()
    subject: string;
    
    @Column()
    verified: boolean;
    
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