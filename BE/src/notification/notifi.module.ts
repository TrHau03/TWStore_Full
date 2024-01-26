import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Notification, NotificationSchema } from "./notifi.schema";
import { NotificationController } from "./notifi.controller";
import { NotificationCpanelController } from "./notifi.cpanel.controller";
import { NotificationService } from "./notifi.service";



@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Notification.name, schema: NotificationSchema },
        ]),
        
    ],

    controllers: [NotificationController, NotificationCpanelController],
    providers: [NotificationService ],
})
export class NotificationModule { }