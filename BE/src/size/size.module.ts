import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Size, SizeSchema } from "./size.schema";
import { SizeController } from "./size.controller";
import { SizeService } from "./size.service";
import { SizesCpanelController } from "./size.cpanel.controller";





@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Size.name, schema: SizeSchema },
        ]),
    ],
    controllers: [SizeController, SizesCpanelController],
    providers: [SizeService],
    exports: [SizeService]
})
export class SizeModule { }