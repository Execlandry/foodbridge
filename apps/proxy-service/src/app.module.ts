import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';

import { AppService } from './app.service';
import { ReverseProxyAuthMiddleware } from './proxy.auth.middleware';
import { ReverseProxyBusinessMiddleware } from './proxy.business.middleware';
import { ReverseProxyDeliveryMiddleware } from './proxy.delivery.middleware';
import { ReverseProxyOrderMiddleware } from './proxy.order.middleware';
import { ReverseProxyCartMiddleware } from './proxy.cart.middleware';
import { ReverseProxyFilesMiddleware } from './proxy.files.middleware';
import { ReverseProxyPaymentMiddleware } from './proxy.payment.middleware';

@Module({
  imports: [],
  controllers: [],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ReverseProxyAuthMiddleware)
      .forRoutes({ path: 'v1/auth-service/*', method: RequestMethod.ALL });

    consumer
      .apply(ReverseProxyCartMiddleware)
      .forRoutes({ path: 'v1/cart-service/*', method: RequestMethod.ALL });

    consumer.apply(ReverseProxyBusinessMiddleware).forRoutes({
      path: 'v1/business-service/*',
      method: RequestMethod.ALL,
    });

    consumer.apply(ReverseProxyDeliveryMiddleware).forRoutes({
      path: 'v1/delivery-service/*',
      method: RequestMethod.ALL,
    });

    consumer.apply(ReverseProxyOrderMiddleware).forRoutes({
      path: 'v1/order-service/*',
      method: RequestMethod.ALL,
    });

    consumer.apply(ReverseProxyFilesMiddleware).forRoutes({
      path: 'v1/files-service/*',
      method: RequestMethod.ALL,
    });
    consumer.apply(ReverseProxyPaymentMiddleware).forRoutes({
      path: 'v1/payment-service/*',
      method: RequestMethod.ALL,
    });
  }
}
