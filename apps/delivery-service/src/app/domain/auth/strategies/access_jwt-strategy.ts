import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@fbe/config";
import { JwtPayload } from "jsonwebtoken";
import * as Debug from "debug";

const verbose = Debug("fbe-business:jwt:verbose");
const error = Debug("fbe-business:jwt:error");

@Injectable()
export class AccessTokenJwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: any) => {
          // 1. Authorization header
          const authHeader = request?.headers?.authorization;
          if (authHeader?.startsWith("Bearer ")) {
            const token = authHeader.split(" ")[1];
            verbose("Token extracted from Authorization header");
            return token;
          }

          // 2. Cookie
          const cookieToken = request?.cookies?.["access_token"];
          if (cookieToken) {
            verbose("Token extracted from cookie");
            return cookieToken;
          }

          verbose("No token found in request");
          return null;
        },
      ]),
      secretOrKey: configService.get().auth.access_token_secret,
    });
  }

  async validate(payload: JwtPayload) {
    if (!payload || !payload.userId || !payload.email || !payload.permissions) {
      throw new UnauthorizedException("Invalid token payload");
    }

    return {
      userId: payload.userId,
      email: payload.email,
      permissions: Array.isArray(payload.permissions)
        ? payload.permissions.join(",")
        : payload.permissions,
    };
  }
}
