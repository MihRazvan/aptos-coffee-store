// orders/dto/create-order.dto.ts
export class CreateOrderDto {
    coffeeId: number;
    price: number;
    buyerAddress: string;
    transactionHash?: string;
}