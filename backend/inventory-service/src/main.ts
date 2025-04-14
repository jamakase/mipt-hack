import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PORT } from './config/configuration';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug'],
    cors: {
      origin: true
    }
  });
  await app.listen(PORT);
}
bootstrap();
