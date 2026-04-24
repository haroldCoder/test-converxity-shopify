import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AffiliatesModule } from './modules/affiliates/presentation/affiliates.module';
import { DashboardModule } from './modules/dahboard/presentation/dashboard.module';
import { TrackingModule } from './modules/tracking/presentation/tracking.module';
import { BillingModule } from './modules/billing/presentation/billing.module';
import { ShopsModule } from './modules/shop/presentation/shop.module';

@Module({
  imports: [AffiliatesModule, DashboardModule, TrackingModule, BillingModule, ShopsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
