import { Files } from 'src/files/entitys/files.entity';
import { Package } from 'src/package/entitys/package.entity';
import { Page } from 'src/page/entitys/page.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
export class Orders {

    @PrimaryGeneratedColumn()
    id: number;

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
    advertiserPage: Page;

    @Column({
        default: 0,
        type: 'integer'
    })
    price: number;

    @Column({
        default: 0,
        type: 'integer'
    })
    status: number;

    @Column()
    adUID: string;

    @Column({
        default: false
    })
    createdByAdReciver: boolean;

    @Column({
        length: 500
    })
    caption: string;

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @DeleteDateColumn()
    deletedAt: Date
}