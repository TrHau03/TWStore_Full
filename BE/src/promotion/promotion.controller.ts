import { Body, Controller, Get, HttpStatus, Post, Res } from "@nestjs/common";
import { PromotionInsertDTO } from "./dto/promotion_insert_request";
import { PromotionService } from "./promotion.service";
import { Response } from "express";
import { PromotionDeleteRequestDTO } from "./dto/promotion_delete_request";
@Controller('promotion')

export class PromotionController {
    constructor(private readonly promotionService: PromotionService) { }

    @Post('addPromotion')
    async AddPromotion(@Body() body: PromotionInsertDTO, @Res() res: Response) {
        try {
            const response = await this.promotionService.addPromotion(body);
            return res.status(HttpStatus.OK).json(response);
        } catch (error) {
            res.status(HttpStatus.BAD_REQUEST).json(error);
        }
    }

    @Get('getAllPromotion')
    async GetAllPromotion(@Res() res: Response) {
        try {
            const response = await this.promotionService.getAllPromotion();
            return res.status(HttpStatus.OK).json(response);
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json(error);
        }
    }
    @Post('deletePromotion')
    async DeletePromotion(@Body() body: PromotionDeleteRequestDTO, @Res() res: Response) {
        try {
            const responseDTO = await this.promotionService.DeletePromotion(body);
            return res.status(HttpStatus.OK).json(responseDTO);
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json(error);
        }
    }
    @Get('getCouponHighest')
    async GetCouponHighest(@Res() res: Response) {
        try {
            const response = await this.promotionService.getPromotionHighest();
            return res.status(HttpStatus.OK).json(response);
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json(error);
        }
    }
}