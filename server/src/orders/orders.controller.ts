// orders/orders.controller.ts
import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Patch,
    Query,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    @Get()
    findAll() {
        return this.ordersService.findAll();
    }

    @Get('buyer')
    findByBuyer(@Query('address') address: string) {
        return this.ordersService.findByBuyer(address);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.ordersService.findOne(+id);
    }

    @Post()
    create(@Body() createOrderDto: CreateOrderDto) {
        return this.ordersService.create(createOrderDto);
    }

    @Patch(':id/transaction')
    updateTransaction(
        @Param('id') id: string,
        @Body('transactionHash') transactionHash: string,
    ) {
        return this.ordersService.updateTransactionHash(+id, transactionHash);
    }
}