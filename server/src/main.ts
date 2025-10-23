import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { CLIENT_APP_URL } from './config/env';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  const clientOrigin = new URL(CLIENT_APP_URL).origin;
  app.enableCors({
    origin: clientOrigin,
    credentials: true, // If you're using cookies or other credentials
    methods: 'GET,POST,PUT,DELETE,OPTIONS,PATCH', // Specify allowed methods
  });
  app.use(cookieParser());
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });
  const port = Number.parseInt(process.env.PORT ?? '4000', 10);
  await app.listen(port);
}
bootstrap();
