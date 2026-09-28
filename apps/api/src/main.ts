import "dotenv/config";
import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Local/dev only: the Web SPA client (ADR.md 3.4/3.4.2) runs on a
  // different origin (Vite dev server / Azure Static Web Apps) than the
  // API, so CORS must be enabled explicitly. Restrict to configured
  // origins rather than wildcard since requests will carry Authorization
  // headers once auth (ADR.md Phase 2) is added.
  const corsOrigins = process.env.CORS_ORIGINS?.split(",").map((o) => o.trim()) ?? [
    "http://localhost:5173",
  ];
  app.enableCors({ origin: corsOrigins });

  // Keeps the `/api/switch/...` route shape used by the previous Azure
  // Functions-based API, so clients don't need a URL change.
  app.setGlobalPrefix("api");

  const port = process.env.PORT ? Number(process.env.PORT) : 3000;
  await app.listen(port);
}

bootstrap();
