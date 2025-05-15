import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { createDocument } from "./docs/swagger";
import * as cookieParser from "cookie-parser";
import { json, urlencoded } from "body-parser";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1) Use a JSON parser with a verify hook to stash the raw body on the request
  app.use(json({
    limit: '10mb',
    verify: (req, _res, buf) => {
      // only save rawBody for the Stripe webhook path
      if (req.originalUrl === '/api/v1/partners/webhook') {
        (req as any).rawBody = buf;
      }
    }
  }));

  // 2) Other parsing / middleware as usual
  app.use(urlencoded({ extended: true }));
  app.use(cookieParser());

  app.setGlobalPrefix('api/v1');
  createDocument(app);
  await app.listen(process.env.PORT || 3002);
}
bootstrap();
