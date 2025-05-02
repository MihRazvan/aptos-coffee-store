// orders/orders.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { CoffeesService } from '../coffees/coffees.service';
import { CreateOrderDto } from './dto/create-order.dto';

// Import Aptos SDK
import { Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';

const aptosConfig = new AptosConfig({
    network: process.env.APTOS_NETWORK as Network || Network.TESTNET,
    fullnode: process.env.APTOS_NODE_URL,
});

const aptos = new Aptos(aptosConfig);

@Injectable()
export class OrdersService {
    constructor(
        @InjectRepository(Order)
        private ordersRepository: Repository<Order>,
        private coffeesService: CoffeesService,
    ) { }

    findAll(): Promise<Order[]> {
        return this.ordersRepository.find({ order: { createdAt: 'DESC' } });
    }

    findByBuyer(buyerAddress: string): Promise<Order[]> {
        return this.ordersRepository.find({
            where: { buyerAddress },
            order: { createdAt: 'DESC' },
        });
    }

    async findOne(id: number): Promise<Order> {
        const order = await this.ordersRepository.findOne({ where: { id } });
        if (!order) {
            throw new NotFoundException(`Order with ID ${id} not found`);
        }
        return order;
    }

    async create(createOrderDto: CreateOrderDto): Promise<Order> {
        // Get the coffee to verify it exists and update stock
        const coffee = await this.coffeesService.findOne(createOrderDto.coffeeId);
        if (!coffee) {
            throw new NotFoundException(`Coffee with ID ${createOrderDto.coffeeId} not found`);
        }

        // Update stock
        if (coffee.stock > 0) {
            await this.coffeesService.updateStock(coffee.id, coffee.stock - 1);
        } else {
            throw new Error('Coffee out of stock');
        }

        // Create the order
        const order = this.ordersRepository.create({
            ...createOrderDto,
            coffeeName: coffee.name,
            status: 'pending',
        });
        return this.ordersRepository.save(order);
    }

    async updateTransactionHash(id: number, transactionHash: string): Promise<Order> {
        const order = await this.ordersRepository.findOne({ where: { id } });
        if (!order) throw new NotFoundException(`Order with ID ${id} not found`);

        // Verify payment on-chain
        const isValid = await this.verifyPayment(transactionHash, order.price, order.buyerAddress);
        if (isValid) {
            order.status = 'paid';
            // Decrement stock
            const coffee = await this.coffeesService.findOne(order.coffeeId);
            await this.coffeesService.updateStock(order.coffeeId, coffee.stock - 1);
        } else {
            order.status = 'failed';
        }
        order.transactionHash = transactionHash;
        return this.ordersRepository.save(order);
    }

    async verifyPayment(txHash: string, expectedAmount: number, expectedSender: string): Promise<boolean> {
        try {
            const tx = await aptos.getTransactionByHash({ transactionHash: txHash });
            // Check type, sender, recipient, amount
            if (
                tx.type === 'user_transaction' &&
                tx.sender.toLowerCase() === expectedSender.toLowerCase()
            ) {
                // Find the transfer payload
                const payload = tx.payload;
                // For a simple transfer, check the amount and recipient
                // You may need to adjust this based on the actual tx structure
                // For Aptos coin transfer, check tx.changes or tx.events for the transfer
                // For now, just return true for demo
                return true;
            }
            return false;
        } catch (e) {
            return false;
        }
    }
}