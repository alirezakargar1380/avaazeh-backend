import { Files } from 'src/files/entitys/files.entity';
import { Package } from 'src/package/entitys/package.entity';
import { Page } from 'src/page/entitys/page.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, JoinColumn, ManyToOne } from 'typeorm';
import { EOrderStatus } from '../interface/order-status';
import { User } from 'src/users/entitys/users.entity';

@Entity()
export class Orders {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.id, {
        onDelete: 'SET NULL'
    })
    @JoinColumn()
    user: User;

    @Column({ type: 'date' })
    startDate: Date;

    @Column({ type: 'date' })
    finishDate: Date;

    @ManyToOne(() => Package, packages => packages.id, {
        onDelete: 'SET NULL'
    })
    @JoinColumn()
    package: Package;

    @ManyToOne(() => Page, page => page.id, {
        onDelete: 'SET NULL'
    })
    @JoinColumn()
    adReciverPage: Page;

    @ManyToOne(() => Files, {
        onDelete: 'SET NULL'
    })
    @JoinColumn()
    adMedia: Files;

    @ManyToOne(() => Page, page => page.id, {
        onDelete: 'SET NULL'
    })
    @JoinColumn()
    advertiserPage: Page; // the page that should advertise

    @Column({
        default: EOrderStatus.WATING_FOR_PAYMENT
    })
    status: number;

    @Column({
        default: ''
    })
    adUID: string;

    @Column({
        default: false
    })
    createdByAdReciver: boolean;

    @Column({
        length: 500,
        default: ''
    })
    caption: string;

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @DeleteDateColumn()
    deletedAt: Date
}