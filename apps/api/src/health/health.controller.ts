import { Controller, Get } from "@nestjs/common";
import type { HealthResponse } from "@tonios/contracts";

@Controller("health")
export class HealthController {
  @Get()
  check(): HealthResponse {
    return {
      service: "tonios-api",
      status: "ok",
      timestamp: new Date().toISOString()
    };
  }
}
