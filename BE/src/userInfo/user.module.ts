import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";



import { UserInfoController } from './user.controller';
import { UserInfoSchema, UsersInfo } from './user.schema';
import { MailerModule } from "@nestjs-modules/mailer";
import { UserInfoService } from "./user.service";
import { UserModule } from "src/user/user.module";

enum MailAdmin {
    EMAIL = "thewondershopfashion@gmail.com",
    //thewondershopfashion@gmail.com
    PASSWORD = "myfcfurdamtnujqg",
    //dgeyqrqpmimvpylr
    HOST = "smtp.gmail.com"
}

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: UsersInfo.name, schema: UserInfoSchema },
        ]),
        MailerModule.forRootAsync({
            useFactory: () => ({
                transport: {
                    service: 'gmail',
                    host: MailAdmin.HOST,
                    auth: {
                        user: MailAdmin.EMAIL,
                        pass: MailAdmin.PASSWORD
                    }
                }
            })
        }),

    ],
    controllers: [UserInfoController],
    providers: [UserInfoService],
    exports:[UserInfoService]
})
export class UserInfoModule { }