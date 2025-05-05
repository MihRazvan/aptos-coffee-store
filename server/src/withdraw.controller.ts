import { Controller, Post, Body } from '@nestjs/common';

@Controller('api')
export class WithdrawController {
    @Post('withdraw')
    async withdrawFunds(@Body() body: { amount: string }) {
        // Here you would call the Move module using admin private key from .env
        // For now, just return success
        return { success: true, txHash: '0xDEMO' };
    }
}
