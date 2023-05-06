import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./auth.controller";
import { UserModule } from "src/user/user.module";
import { PrismaModule } from "src/prisma/prisma.module";
import { AuthService } from "./auth.service";

@Module({
    imports: [JwtModule.register({
        secret: "TISUN%Cq*85nc*u94HCf6n1h4I7g%f4*"
        }),
        UserModule,
        PrismaModule
    ],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule{

}