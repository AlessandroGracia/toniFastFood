import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const port = Number(process.env.API_PORT ?? process.env.PORT ?? 3001);

  app.setGlobalPrefix("v1");
  app.enableShutdownHooks();
  app.enableCors({
    credentials: true,
    origin: process.env.CORS_ORIGIN?.split(",") ?? true
  });

  await app.listen(port);
  const url = await app.getUrl();
  console.log(`ToniOS API listening on ${url}`);
}

void bootstrap();
