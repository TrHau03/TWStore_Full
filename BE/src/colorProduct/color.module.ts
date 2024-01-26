import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Color, ColorSchema } from "./color.schema";
import { ColorController } from "./color.controller";
import { ColorService } from "./color.service";
import { ColorsCpanelController } from "./color.cpanel.controller";





@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Color.name, schema: ColorSchema },
        ]),
    ],
    controllers: [ColorController, ColorsCpanelController],
    providers: [ColorService],
    exports: [ColorService]
})
export class ColorModule { }