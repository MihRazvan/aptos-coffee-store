// orders/order.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    coffeeId: number;

    @Column()
    coffeeName: string;

    @Column()
    price: number;

    @Column()
    buyerAddress: string;

    @Column({ nullable: true })
    transactionHash: string;

    @Column({ default: 'pending' })
    status: 'pending' | 'paid' | 'failed';

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
}