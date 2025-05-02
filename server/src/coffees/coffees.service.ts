// coffees/coffees.service.ts
import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Coffee } from './coffee.entity';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { AptosConfig, Network } from '@aptos-labs/ts-sdk';

const STANDARD_COFFEES = [
    { name: 'Americano', price: 300, stock: 20, image: 'americano.png' },
    { name: 'Cappuccino', price: 350, stock: 15, image: 'cappuccino.png' },
    { name: 'Espresso', price: 250, stock: 20, image: 'espresso.png' },
    { name: 'Latte', price: 400, stock: 15, image: 'latte.png' },
    { name: 'Mocha', price: 450, stock: 10, image: 'mocha.png' },
];

const aptosConfig = new AptosConfig({
    network: process.env.APTOS_NETWORK as Network || Network.TESTNET,
    fullnode: process.env.APTOS_NODE_URL,
});

@Injectable()
export class CoffeesService implements OnModuleInit {
    constructor(
        @InjectRepository(Coffee)
        private coffeesRepository: Repository<Coffee>,
    ) { }

    async onModuleInit() {
        await this.seedStandardCoffees();
    }

    async seedStandardCoffees() {
        const existing = await this.coffeesRepository.find();
        for (const coffee of STANDARD_COFFEES) {
            if (!existing.find(c => c.name === coffee.name)) {
                await this.coffeesRepository.save(coffee);
            }
        }
        // Optionally, remove any coffees not in the standard list:
        // for (const coffee of existing) {
        //   if (!STANDARD_COFFEES.find(c => c.name === coffee.name)) {
        //     await this.coffeesRepository.delete(coffee.id);
        //   }
        // }
    }

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

    async updatePrice(id: number, price: number): Promise<Coffee> {
        await this.coffeesRepository.update(id, { price });
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
}