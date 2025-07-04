import { Injectable } from "@nestjs/common";
import { DEFAULT_CONFIG } from "./config.default";
import {
  AWSConfig,
  ConfigData,
  ConfigDatabase,
  ConfigSwagger,
} from "./config.interface";

@Injectable()
export class ConfigService {
  private config: ConfigData;
  constructor(data: ConfigData = DEFAULT_CONFIG) {
    this.config = data;
  }

  public loadFromEnv() {
    this.config = this.parseConfigFromEnv(process.env);
  }

  private parseConfigFromEnv(env: NodeJS.ProcessEnv): ConfigData {
    return {
      env: env.NODE_ENV || DEFAULT_CONFIG.env,
      port: parseInt(env.PORT!, 10),
      db: this.parseDBConfig(env, DEFAULT_CONFIG.db),
      swagger: this.parseSwaggerConfig(env, DEFAULT_CONFIG.swagger),
      aws: this.parseAWSConfig(env, DEFAULT_CONFIG.aws),
      logLevel: env.LOG_LEVEL!,
      userServiceUrl: env.USER_SERVICE_URL || DEFAULT_CONFIG.userServiceUrl,
      auth: {
        expiresIn: Number(env.TOKEN_EXPIRY),
        access_token_secret: env.JWT_ACCESS_TOKEN_SECRET!,
        refresh_token_secret: env.JWT_REFRESH_TOKEN_SECRET!,
      },
      redis: {
        host: env.REDIS_HOST!,
        port: Number(env.REDIS_PORT),
      },
      google: {
        oauth_google_id: env.OAUTH_GOOGLE_ID!,
        oauth_google_callback: env.OAUTH_GOOGLE_REDIRECT_URL!,
        oauth_google_secret: env.OAUTH_GOOGLE_SECRET!,
      },
      elastic: {
        url: env.ELASTIC_SEARCH_NODE!,
        username: env.ELASTIC_SEARCH_USERNAME!,
        password: env.ELASTIC_SEARCH_PASSWORD!,
        index: env.ELASTIC_SEARCH_INDEX,
      },
    };
  }
  private parseDBConfig(
    env: NodeJS.ProcessEnv,
    defaultConfig: Readonly<ConfigDatabase>
  ) {
    return {
      url: env.DATABASE_URL || defaultConfig.url,
    };
  }
  private parseAWSConfig(
    env: NodeJS.ProcessEnv,
    defaultConfig: Readonly<AWSConfig>
  ) {
    return {
      accessKeyId: env.AWS_ACCESS_KEY_ID || defaultConfig.accessKeyId,
      secretAccessKey:
        env.AWS_SECRET_ACCESS_KEY || defaultConfig.secretAccessKey,
      region: env.AWS_REGION || defaultConfig.region,
      bucket: env.S3_BUCKET || defaultConfig.bucket,
    };
  }
  private parseSwaggerConfig(
    env: NodeJS.ProcessEnv,
    defaultConfig: Readonly<ConfigSwagger>
  ) {
    return {
      username: env.SWAGGER_USERNAME || defaultConfig.username,
      password: env.SWAGGER_PASSWORD || defaultConfig.password,
    };
  }

  public get(): Readonly<ConfigData> {
    return this.config;
  }
}
