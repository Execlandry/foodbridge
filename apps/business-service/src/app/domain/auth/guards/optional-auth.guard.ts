import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class OptionalAccessTokenGuard extends AuthGuard("jwt") {
  handleRequest(err, user, info, context) {
    // Allow both authenticated and unauthenticated users
    return user || null;
  }
}
