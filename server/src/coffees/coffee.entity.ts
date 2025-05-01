// coffees/coffee.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Coffee {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    price: number;

    @Column()
    stock: number;

    @Column({ nullable: true })
    image: string;

    @Column({ default: true })
    available: boolean;
}