import { User } from 'src/users/entitys/users.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { EPackageAction } from '../interface/package-action';

@Entity()
export class Package {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.id, {
        onDelete: 'SET NULL'
    })
    @JoinColumn()
    user: User;

    @Column({
        default: 0,
        type: 'integer'
    })
    price: number;

    @Column({
        type: 'enum',
        enum: EPackageAction,
        // default: EPaymentStatus.pending
    })
    action: EPackageAction;

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @DeleteDateColumn()
    deletedAt: Date
}