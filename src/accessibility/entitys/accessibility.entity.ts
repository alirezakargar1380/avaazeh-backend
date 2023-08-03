import { Role } from 'src/role/entitys/role.entity';
import { Entity, Column, JoinColumn, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToOne } from 'typeorm';

@Entity()
export class Accessbility {

    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => Role, {
        onDelete: "NO ACTION"
    })
    @JoinColumn()
    role: Role;

    @Column({
        default: false
    })
    all_organ_access: boolean; 

    @Column({
        default: false
    })
    admin_organ: boolean;

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @DeleteDateColumn()
    deletedAt: Date
}