import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { JwtPayload } from "jsonwebtoken";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@fbe/config";
import { debug } from "debug";

const verbose = debug("fbe-business:verbose:handler");
const error = debug("fbe-business:verbose:handler");

// Bearer <>//

@Injectable()
export class AccessTokenJwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      // get token from cookies doe cart services
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: any) => {
          console.log(request.cookies);
          let data = request?.cookies["access_token"];
          if (!data) {
            return null;
          }
          return data;
        },
      ]),
      secretOrKey: configService.get().auth.access_token_secret,
    });
  }
  async validate(payload: JwtPayload) {
    if (!payload) {
      throw new UnauthorizedException();
    }
    return payload;
  }
}
