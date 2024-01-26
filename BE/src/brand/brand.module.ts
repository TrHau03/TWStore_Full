import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Brand, BrandSchema } from "./brand.schema";
import { BrandController } from "./brand.controller";
import { BrandService } from "./brand.service";
import { BrandsCpanelController } from "./brand.cpanel.controller";





@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Brand.name, schema: BrandSchema },
        ]),
    ],
    controllers: [BrandController, BrandsCpanelController],
    providers: [BrandService],
    exports: [BrandService]
})
export class BrandModule { }