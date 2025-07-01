import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { JwtPayload } from "jsonwebtoken";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@fbe/config";
import { AuthService } from "../auth.service";

// Bearer <>//

@Injectable()
export class AccessTokenJwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: any) => {
          // 1. Try Authorization Header
          const authHeader = request?.headers?.authorization;
          if (authHeader?.startsWith("Bearer ")) {
            return authHeader.split(" ")[1];
          }

          // 2. Try Cookie
          const cookieToken = request?.cookies?.["access_token"];
          if (cookieToken) {
            return cookieToken;
          }

          // 3. Default to null
          return null;
        },
      ]),
      secretOrKey: configService.get().auth.access_token_secret,
    });
  }
  async validate(payload: JwtPayload) {
    const user = await this.authService.validateJwtPayload(payload);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
