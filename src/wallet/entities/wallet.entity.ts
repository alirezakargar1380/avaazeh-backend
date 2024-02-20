import { User } from "src/users/entitys/users.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Wallets {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        default: 0
    })
    budget: number;

    @OneToOne(() => User, user => user.id, {
        onDelete: 'SET NULL',
    })
    @JoinColumn()
    user: User;
}