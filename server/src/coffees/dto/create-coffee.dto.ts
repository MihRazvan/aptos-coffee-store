// coffees/dto/create-coffee.dto.ts
export class CreateCoffeeDto {
    name: string;
    price: number;
    stock: number;
    image?: string;
}