// orders/orders.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { CoffeesService } from '../coffees/coffees.service';
import { CreateOrderDto } from './dto/create-order.dto';

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
        });
        return this.ordersRepository.save(order);
    }

    async updateTransactionHash(id: number, transactionHash: string): Promise<Order> {
        await this.ordersRepository.update(id, { transactionHash });
        const updatedOrder = await this.ordersRepository.findOne({ where: { id } });
        if (!updatedOrder) {
            throw new NotFoundException(`Order with ID ${id} not found`);
        }
        return updatedOrder;
    }
}