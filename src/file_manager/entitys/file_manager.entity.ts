import { Files } from 'src/files/entitys/files.entity';
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToOne, ManyToMany, JoinTable, OneToMany } from 'typeorm';
  
@Entity()
export class FileManager {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Files, files => files.id, {
        onDelete: 'NO ACTION'
    })
    @JoinColumn()
    file: Files;

    @ManyToOne(() => Files, files => files.id, {
        onDelete: 'NO ACTION',
        nullable: true
    })
    @JoinColumn()
    belongsTo: Files;

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @DeleteDateColumn()
    deletedAt: Date
}