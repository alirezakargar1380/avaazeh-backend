import { Role } from 'src/role/entitys/role.entity';
import { Entity, Column, JoinColumn, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToOne } from 'typeorm';

@Entity()
export class VariableSettingsAcc {

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
    get: boolean; 

    @Column({
        default: false
    })
    add: boolean; 

    @Column({
        default: false
    })
    delete: boolean; 

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @DeleteDateColumn()
    deletedAt: Date
}