import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Render, Res, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from "@nestjs/common";
import { BannerService } from "./banner.service";
import { BannerInsertDTO } from "./dto/banner_insert_request";
import { Response } from "express";
import { FileFieldsInterceptor, FileInterceptor } from "@nestjs/platform-express";
import { Types } from "mongoose";
import { AuthenticatedGuard } from "src/auth/authWeb.guard";

@Controller('bannerCpanel')
export class BannerCpanelController {
    constructor(private readonly bannerService: BannerService) { }

    @UseGuards(AuthenticatedGuard)
    @Get('quanlybanner')
    @Render('quanlybanner')
    async quanlysanpham(@Res() res: Response) {
        try {
            const response = await this.bannerService.getAllBanner();
            return { banner: response.banner };
        } catch (error) {
        }
    }
    @UseGuards(AuthenticatedGuard)
    @Get('addBanner')
    @Render('addBanner')
    async AddBanner(@Res() res: Response) {
        try {
            return {};
        } catch (error) {
            return error;
        }
    }
    @UseInterceptors(FileInterceptor('image'))
    @Post('addBanner')
    async addBanner(@Body() body: any, @UploadedFile() files: Express.Multer.File, @Res() res: Response) {
        try {
            if (!files) {
                return null;
            }
            await this.bannerService.addBanner({ body, files });
            return res.redirect('/bannerCpanel/quanlybanner');
        } catch (error) {
            console.log(error);
        }
    }
    @Delete('deleteBanner/:_id')
    async deleteBanner(@Param() _id: Types.ObjectId, @Res() res: Response) {
        try {
            await this.bannerService.deleteBanner(_id);
            return res.json({ result: true });
        } catch (error) {
            console.log(error);
        }
    }
}
