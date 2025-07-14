import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createProxyMiddleware } from 'http-proxy-middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: false });
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  app.use((req, _, next) => {
    console.log(`Got invoked: ${req.originalUrl}`);
    next();
  });

  app.use(
    `/api/v1/user-service`,
    createProxyMiddleware({
      target: 'http://localhost:3002',
      pathRewrite: {
        '^/api/v1/user-service': '/api/v1',
      },
      changeOrigin: true,
      secure: false,
      selfHandleResponse: false,
      onProxyReq: (proxyReq, req, res) => {
        console.log(`[Proxy]: Forwarding ${req.method} ${req.originalUrl}`);
      },
    }),
  );

  // app.use(
  //   /api/v1/auth-service,
  //   createProxyMiddleware({
  //     target: 'http://localhost:3000',
  //     pathRewrite: {
  //       '^/api/v1/auth-service': '/api/v1',
  //     },
  //     changeOrigin: true,
  //     secure: false,
  //     selfHandleResponse: false,
  //     onProxyReq: (proxyReq, req, res) => {
  //       console.log([Proxy]: Forwarding ${req.method} ${req.originalUrl});
  //     },
  //   }),
  // );

  await app.listen(3001, '0.0.0.0');
}
bootstrap();