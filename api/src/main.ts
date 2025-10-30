// apps/.../main.ts
import { Logger } from '@nestjs/common';
import { setupGlobalSwagger } from './common/swagger/global-swagger';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  setupGlobalSwagger(app);

  const PORT = Number(process.env.PORT ?? 8080);
  await app.listen(PORT);

  Logger.log(
    `🚀 Swagger is live at http://localhost:3000/api/docs`,
    'Bootstrap',
  );
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
