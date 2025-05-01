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

@Controller('coffees')
export class CoffeesController implements OnModuleInit {
    constructor(private readonly coffeesService: CoffeesService) { }

    async onModuleInit() {
        // Seed the database when the module initializes
        await this.coffeesService.seed();
    }

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

    @Patch(':id/stock')
    updateStock(@Param('id') id: string, @Body('stock') stock: number) {
        return this.coffeesService.updateStock(+id, stock);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.coffeesService.remove(+id);
    }
}