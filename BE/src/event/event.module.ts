import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { EventSchema } from "./event.schema";
import { EventService } from "./event.service";
import { EventController } from "./event.controller";
import { ProductModule } from "src/product/product.module";
import { EventsCpanelController } from "./event.cpanel.controller";


@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Event.name, schema: EventSchema },
        ]),
        ProductModule
    ],

    controllers: [EventController, EventsCpanelController],
    providers: [EventService ],
    exports: [EventService],
})
export class EventModule { }