import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Banner, BannerSchema } from "./banner.schema";
import { BannerService } from "./banner.service";
import { BannerController } from "./banner.controller";
import { BannerCpanelController } from "./banner.cpanel.controller";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Banner.name, schema: BannerSchema },
        ]),
    ],
    controllers: [BannerController, BannerCpanelController],
    providers: [BannerService],
})
export class BannerModule { }