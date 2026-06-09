import { Module } from "@nestjs/common";
import { CatalogModule } from "./catalog/catalog.module";
import { HealthController } from "./health/health.controller";
import { PrismaModule } from "./prisma/prisma.module";

@Module({
  imports: [PrismaModule, CatalogModule],
  controllers: [HealthController]
})
export class AppModule {}
