// coffees/coffees.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Coffee } from './coffee.entity';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';

@Injectable()
export class CoffeesService {
    constructor(
        @InjectRepository(Coffee)
        private coffeesRepository: Repository<Coffee>,
    ) { }

    findAll(): Promise<Coffee[]> {
        return this.coffeesRepository.find({
            where: { available: true },
            order: { id: 'ASC' }
        });
    }

    findAllAdmin(): Promise<Coffee[]> {
        return this.coffeesRepository.find({ order: { id: 'ASC' } });
    }

    async findOne(id: number): Promise<Coffee> {
        const coffee = await this.coffeesRepository.findOne({ where: { id } });
        if (!coffee) {
            throw new NotFoundException(`Coffee with ID ${id} not found`);
        }
        return coffee;
    }

    async create(createCoffeeDto: CreateCoffeeDto): Promise<Coffee> {
        const newCoffee = this.coffeesRepository.create(createCoffeeDto);
        return this.coffeesRepository.save(newCoffee);
    }

    async update(id: number, updateCoffeeDto: UpdateCoffeeDto): Promise<Coffee> {
        await this.coffeesRepository.update(id, updateCoffeeDto);
        const updatedCoffee = await this.coffeesRepository.findOne({ where: { id } });
        if (!updatedCoffee) {
            throw new NotFoundException(`Coffee with ID ${id} not found`);
        }
        return updatedCoffee;
    }

    async updateStock(id: number, stock: number): Promise<Coffee> {
        await this.coffeesRepository.update(id, { stock });
        const updatedCoffee = await this.coffeesRepository.findOne({ where: { id } });
        if (!updatedCoffee) {
            throw new NotFoundException(`Coffee with ID ${id} not found`);
        }
        return updatedCoffee;
    }

    async remove(id: number): Promise<void> {
        const result = await this.coffeesRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Coffee with ID ${id} not found`);
        }
    }

    // Add seed data if the coffee table is empty
    async seed(): Promise<void> {
        const count = await this.coffeesRepository.count();
        if (count === 0) {
            const coffees = [
                {
                    name: 'Espresso',
                    price: 250, // 2.50 APT
                    stock: 20,
                    image: 'espresso.png',
                },
                {
                    name: 'Cappuccino',
                    price: 350, // 3.50 APT
                    stock: 15,
                    image: 'cappuccino.png',
                },
                {
                    name: 'Latte',
                    price: 400, // 4.00 APT
                    stock: 15,
                    image: 'latte.png',
                },
                {
                    name: 'Americano',
                    price: 300, // 3.00 APT
                    stock: 25,
                    image: 'americano.png',
                },
                {
                    name: 'Mocha',
                    price: 450, // 4.50 APT
                    stock: 10,
                    image: 'mocha.png',
                },
            ];

            await this.coffeesRepository.save(coffees);
        }
    }
}