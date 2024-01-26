import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Order, OrderSchema } from "./order.schema";
import { OrderService } from "./order.service";
import { OrderController } from "./order.controller";
import { OrderCpanelController } from "./order.cpanel.controller";
import { PromotionModule } from "src/promotion/promotion.module";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Order.name, schema: OrderSchema },
        ]),
        PromotionModule
    ],
    controllers: [OrderController, OrderCpanelController],
    providers: [OrderService],
    exports :[OrderService]
})
export class OrderModule { }