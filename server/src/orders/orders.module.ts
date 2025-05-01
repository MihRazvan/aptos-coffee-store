// orders/orders.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { Order } from './order.entity';
import { CoffeesModule } from '../coffees/coffees.module';

@Module({
    imports: [TypeOrmModule.forFeature([Order]), CoffeesModule],
    controllers: [OrdersController],
    providers: [OrdersService],
})
export class OrdersModule { }