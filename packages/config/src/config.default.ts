import { ConfigData } from "./config.interface";

export const DEFAULT_CONFIG: ConfigData = {
  port: Number(process.env.PORT || 3001),
  env: "production",
  db: {
    url: process.env.DATABASE_URL!,
  },
  auth: {
    expiresIn: 30000,
    access_token_secret: "",
    refresh_token_secret: "",
  },
  userServiceUrl:
    process.env.USER_SERVICE_URL ||
    "http://localhost:3001/api/v1/user-service/",
  redis: {
    host: "localhost",
    port: 6379,
  },
  google: {
    oauth_google_id: "",
    oauth_google_callback: "",
    oauth_google_secret: "",
  },
  swagger: {
    username: "",
    password: "",
  },
  aws: {
    accessKeyId: "",
    secretAccessKey: "",
    region: "",
    bucket: "",
  },
  logLevel: "",
  elastic: {
    url: "",
  },
};
