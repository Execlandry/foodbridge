import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createProxyMiddleware } from 'http-proxy-middleware';
// import { json } from 'express';
async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: false });
  const globalPrefix = 'api';
  // app.use(json());
  app.setGlobalPrefix(globalPrefix);

  app.use((req, _, next) => {
    console.log(`Got invoked: '${req.originalUrl}'`);
    next();
  });

  app.use(
    `/api/v1/user-service/*`,
    createProxyMiddleware({
      target: 'http://localhost:3002/api/v1/', // adjust to actual user-service port
      pathRewrite: {
        '^/api/v1/user-service': '', // strip prefix
      },
      changeOrigin: true,
      secure: false,
      selfHandleResponse: false, // ✅ Let proxy handle streaming
      onProxyReq: (proxyReq, req, res) => {
        console.log(
          `[Proxy]: Forwarding ${req.method} ${req.originalUrl} → ${proxyReq.getHeader('host')}${proxyReq.path}`
        );
      },
    }),
  );
  /*
  app.use(
    `/api/v1/auth-service/*`,
    createProxyMiddleware({
      target: 'http://localhost:3000/api/v1/',
      pathRewrite: {
        '/api/v1/auth-service': '/',
      },
      secure: false,
      onProxyReq: (proxyReq, req, res) => {
        console.log(proxyReq);
        console.log(
          `[NestMiddleware]: Proxying ${req.method} request originally made to '${req.originalUrl}'...`,
        );
      },
    }),
  );
*/
  await app.listen(3001, '0.0.0.0', () => {
    //console.log('Listening at http://localhost:' + 3001 + '/' + globalPrefix);
  });
}
bootstrap();
