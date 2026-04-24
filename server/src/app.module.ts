import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AffiliatesModule } from './modules/affiliates/presentation/affiliates.module';

@Module({
  imports: [AffiliatesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
