import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { UserInfoModule } from "src/userInfo/user.module";
import { jwtConstants } from "./constants";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { PassportModule } from "@nestjs/passport";
import { LocalStrategy } from "./local.strategy";
import { SessionSerializer } from "./session";

@Module({
    imports: [
        UserInfoModule,
        PassportModule
    ],
    providers: [AuthService,LocalStrategy, SessionSerializer],
    controllers: [AuthController],
    exports: [AuthService],
})
export class AuthModule { }