import { Module } from "@nestjs/common";
import { Promotion, PromotionSchema } from "./promotion.schema";

import { PromotionController } from "./promotion.controller";
import { PromotionService } from "./promotion.service";
import { MongooseModule } from "@nestjs/mongoose";
import { PromotionCpanelController } from "./promotion.cpanel.controller";
@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Promotion.name, schema: PromotionSchema },
        ]),
    ],
    controllers: [PromotionController, PromotionCpanelController],
    providers: [PromotionService],
    exports: [PromotionService]
})
export class PromotionModule { }