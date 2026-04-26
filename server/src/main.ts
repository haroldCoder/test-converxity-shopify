import "dotenv/config";
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from "@nestjs/common";
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { bootstrapDevData } from "./common/infrastructure/database/prisma/bootstrap";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // crear conexion con rabbitmq
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
      queue: 'events_queue',
      queueOptions: {
        durable: true,
      },
    },
  });

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();

  // Asegurar datos de prueba en desarrollo
  await bootstrapDevData();

  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 3000);
  console.log(`[Main] Application is running on: ${await app.getUrl()}`);
  console.log(`[Main] Microservices started`);
}
bootstrap();


