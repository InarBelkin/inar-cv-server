import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';

async function bootstrap() {
  const PORT = process.env.PORT || 4000;
  const app = await NestFactory.create(AppModule, { cors: true });
  await app.listen(PORT, () => console.log(`Server started n port = ${PORT}`));
  console.log(
    `POSTGRES_MIGRATIONS_RUN: ${Boolean(process.env.POSTGRES_MIGRATIONS_RUN)}`,
  );
  console.log(
    `POSTGRES_MIGRATIONS_RUN: ${process.env.POSTGRES_MIGRATIONS_PATH}`,
  );
  console.log(
    `POSTGRES_MIGRATIONS_RUN: ${join(__dirname, './migrations/{.ts,*.js}')}`,
  );
}

bootstrap();
