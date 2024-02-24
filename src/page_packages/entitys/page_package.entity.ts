import { Package } from 'src/package/entitys/package.entity';
import { Page } from 'src/page/entitys/page.entity';
import { User } from 'src/users/entitys/users.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
export class PagePackage {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Page, page => page.id, {
        onDelete: 'SET NULL'
    })
    @JoinColumn()
    page: Page;

    @ManyToOne(() => Package, pac => pac.id, {
        onDelete: 'SET NULL'
    })
    @JoinColumn()
    package: Package;
}