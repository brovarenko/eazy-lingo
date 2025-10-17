import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:3000', // Allow this specific origin
    credentials: true, // If you're using cookies or other credentials
    methods: 'GET,POST,PUT,DELETE,OPTIONS,PATCH', // Specify allowed methods
  });
  app.use(cookieParser());
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });
  await app.listen(4000);
}
bootstrap();
