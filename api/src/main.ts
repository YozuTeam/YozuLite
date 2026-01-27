import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Yozu API')
    .setDescription(
      `
## API Documentation

Cette API fournit les endpoints pour:
- **Authentification**: Register, Login, Refresh tokens
- **Utilisateurs**: Gestion de profil utilisateur
- **Profils Étudiants**: CRUD des profils étudiants
- **Profils Entreprises**: CRUD des profils entreprises

### Authentification
La plupart des endpoints nécessitent un **Bearer Token** (JWT).
Utilisez le bouton "Authorize" ci-dessus pour saisir votre token.
    `,
    )
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Entrez votre access token JWT',
      },
      'bearerAuth',
    )
    .addTag('Users', 'Gestion du profil utilisateur connecté')
    .addTag('Students', 'Gestion des profils étudiants')
    .addTag('Companies', 'Gestion des profils entreprises')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'list',
      filter: true,
      showRequestDuration: true,
    },
  });

  const PORT = Number(process.env.PORT ?? 8080);
  await app.listen(PORT);

  Logger.log(
    `🚀 Application is running on http://localhost:${PORT}`,
    'Bootstrap',
  );
  Logger.log(
    `📚 Swagger is live at http://localhost:${PORT}/api/docs`,
    'Bootstrap',
  );
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
