import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AffiliatesModule } from './modules/affiliates/presentation/affiliates.module';
import { DashboardModule } from './modules/dahboard/presentation/dashboard.module';
import { TrackingModule } from './modules/tracking/presentation/tracking.module';
import { BillingModule } from './modules/billing/presentation/billing.module';
import { ShopsModule } from './modules/shop/presentation/shop.module';
import { RedisCacheModule } from './common/infrastructure/cache/redis-cache.module';
import { EventsModule } from './common/infrastructure/events/events.module';

@Module({
  imports: [
    RedisCacheModule,
    EventsModule,
    AffiliatesModule,
    DashboardModule,
    TrackingModule,
    BillingModule,
    ShopsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule { }
