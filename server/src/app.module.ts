// server/src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoffeesModule } from './coffees/coffees.module';
import { OrdersModule } from './orders/orders.module';
import { FundsController } from './funds.controller';
import { WithdrawController } from './withdraw.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const databaseUrl = configService.get('DATABASE_URL');

        if (databaseUrl) {
          // For Render deployment
          return {
            type: 'postgres',
            url: databaseUrl,
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: true,
            ssl: {
              rejectUnauthorized: false, // Needed for Render PostgreSQL
            },
          };
        } else {
          // For local development
          return {
            type: 'postgres',
            host: configService.get('DATABASE_HOST') || 'localhost',
            port: parseInt(configService.get('DATABASE_PORT') || '5432'),
            username: configService.get('DATABASE_USERNAME') || 'postgres',
            password: configService.get('DATABASE_PASSWORD') || 'postgres',
            database: configService.get('DATABASE_NAME') || 'aptos_coffee_shop',
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: true,
          };
        }
      },
    }),
    CoffeesModule,
    OrdersModule,
  ],
  controllers: [AppController, FundsController, WithdrawController],
  providers: [AppService],
})
export class AppModule { }