require("dotenv").config();
import { NestFactory } from "@nestjs/core";
import { Transport, MicroserviceOptions } from "@nestjs/microservices";
import { AppModule } from "./app.module";
import { createDocument } from "./docs/swagger";
import * as cookieParser from "cookie-parser";
import { ValidationPipe } from "@nestjs/common";
import { json, urlencoded } from "body-parser";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = "api/v1";

  //Use raw body for Stripe webhook verification
  app.use(
    json({
      limit: "10mb",
      verify: (req, _res, buf) => {
        if (req.originalUrl === "/api/v1/payouts/stripe-webhook") {
          (req as any).rawBody = buf;
        }
      },
    })
  );

  app.use(urlencoded({ extended: true }));
  app.use(cookieParser());

  app.use((req, _, next) => {
    console.log(`Incoming request: ${req.method} ${req.originalUrl}`);
    next();
  });

  app.enableCors({
    origin: true,
    methods: ["GET", "POST"],
    credentials: true,
  });

  app.setGlobalPrefix(globalPrefix);
  app.useGlobalPipes(new ValidationPipe());

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ["amqp://guest:guest@localhost:5672/admin"],
      queue: "order-messages",
      queueOptions: {
        durable: false,
      },
    },
  });

  await app.startAllMicroservices(); // Start RMQ listener

  // ✅ 6) Swagger and server boot
  createDocument(app);
  await app.listen(3005);
  console.log("✅ HTTP server listening on port 3005 with RMQ connected.");
}

bootstrap();
