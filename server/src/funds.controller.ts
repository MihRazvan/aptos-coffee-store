import { Controller, Get, Query } from '@nestjs/common';
import axios from 'axios';
import * as dotenv from 'dotenv';
dotenv.config();

@Controller('api')
export class FundsController {
    @Get('shop-funds')
    async getShopFunds(@Query('address') address?: string) {
        const shopAddress = address || process.env.ADMIN_ADDRESS;
        const nodeUrl = process.env.APTOS_NODE_URL || 'https://fullnode.testnet.aptoslabs.com/v1';
        const url = `${nodeUrl}/accounts/${shopAddress}/resources`;
        const response = await axios.get(url);
        const coinResource = response.data.find((r: any) =>
            r.type === '0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>'
        );
        return { balance: coinResource ? coinResource.data.coin.value : '0' };
    }
}
