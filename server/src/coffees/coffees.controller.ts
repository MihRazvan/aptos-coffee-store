// coffees/coffees.controller.ts
import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    OnModuleInit,
} from '@nestjs/common';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { Network } from '@aptos-labs/ts-sdk';
import { AptosConfig } from '@aptos-labs/ts-sdk';

@Controller('coffees')
export class CoffeesController {
    constructor(private readonly coffeesService: CoffeesService) { }

    @Get()
    findAll() {
        return this.coffeesService.findAll();
    }

    @Get('admin')
    findAllAdmin() {
        return this.coffeesService.findAllAdmin();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.coffeesService.findOne(+id);
    }

    @Post()
    create(@Body() createCoffeeDto: CreateCoffeeDto) {
        return this.coffeesService.create(createCoffeeDto);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateCoffeeDto: UpdateCoffeeDto) {
        return this.coffeesService.update(+id, updateCoffeeDto);
    }

    @Patch(':id/price')
    updatePrice(@Param('id') id: string, @Body('price') price: number) {
        return this.coffeesService.updatePrice(+id, price);
    }

    @Patch(':id/stock')
    updateStock(@Param('id') id: string, @Body('stock') stock: number) {
        return this.coffeesService.updateStock(+id, stock);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.coffeesService.remove(+id);
    }
}

const aptosConfig = new AptosConfig({
    network: process.env.APTOS_NETWORK as Network || Network.TESTNET,
    fullnode: process.env.APTOS_NODE_URL,
});