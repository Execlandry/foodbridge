require("dotenv").config();
import { NestFactory } from "@nestjs/core";
import { Transport, MicroserviceOptions } from "@nestjs/microservices";
import { AppModule } from "./app.module";
import { createDocument } from "./docs/swagger";
import * as cookieParser from "cookie-parser";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = "api/v1";
  app.setGlobalPrefix(globalPrefix);
  app.use(cookieParser());
  app.use((req, _, next) => {
    console.log(`Incoming request: ${req.method} ${req.originalUrl}`);
    next();
  });

  app.enableCors({
    // origin: ['http://localhost:3000', 'https://your-frontend-domain.com'],
    origin:true,
    methods: ['GET', 'POST'],
    credentials: true,
  });

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
  createDocument(app);
  await app.listen(3005); // Start HTTP server
  console.log("✅ HTTP server listening on port 3005 with RMQ connected.");
}
bootstrap();
