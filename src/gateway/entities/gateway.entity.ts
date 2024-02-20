import { User } from "src/users/entitys/users.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Gateway {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.id, {
        onDelete: 'SET NULL'
    })
    @JoinColumn()
    user: User;

    @Column({
        default: 0
    })
    charge_amount: number;

    @Column({
        default: false
    })
    verified: boolean;

    @Column({
        default: ''
    })
    ref_id: string;

    @Column({
        default: ''
    })
    authority: string;
}
