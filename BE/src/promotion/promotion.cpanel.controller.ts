import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Render,
  Res,
  UseGuards,
} from '@nestjs/common';
import { PromotionService } from './promotion.service';
import { Response } from 'express';
import { Types } from 'mongoose';
import { PromotionDeleteRequestDTO } from './dto/promotion_delete_request';
import { PromotionInsertDTO } from './dto/promotion_insert_request';
import { AuthenticatedGuard } from 'src/auth/authWeb.guard';
@Controller('promotionsCpanel')
export class PromotionCpanelController {
  constructor(private readonly promotionService: PromotionService) {}
  @UseGuards(AuthenticatedGuard)
  @Get('quanlymagiamgia')
  @Render('quanlymagiamgia')
  async quanlymagiamgia(@Res() res: Response) {
    try {
      const promotions = await this.promotionService.getAllPromotion();
      const newPromotions = promotions.map((promotion) => {
        const dateStart = new Date(promotion.startDay);
        const dateEnd = new Date(promotion.endDay);
        return {
          promotion: promotion,
          start: ` ${dateStart.getDate()} / ${dateStart.getMonth() + 1} / ${
            dateStart.getFullYear()
          }`,
          end: ` ${dateEnd.getDate()} / ${dateEnd.getMonth() + 1} / ${
            dateEnd.getFullYear()
          }`,
        };
      });
      
      return { newPromotions };
    } catch (error) {}
  }
  @UseGuards(AuthenticatedGuard)
  @Get('addPromotion')
  @Render('addPromotion')
  async AddPromotion(@Res() res: Response) {
    try {
      return {};
    } catch (error) {
      return error;
    }
  }
  @Post('addPromotion')
  async addPromotion(@Body() body: PromotionInsertDTO, @Res() res: Response) {
    try {
      await this.promotionService.addPromotion(body);
      return res.redirect('/promotionsCpanel/quanlymagiamgia');
    } catch (error) {
      console.log(error);
    }
  }
  @Delete('quanlymagiamgia/:_id/delete')
  async deletePromotion(
    @Param() _id: PromotionDeleteRequestDTO,
    @Res() res: Response,
  ) {
    try {
      await this.promotionService.DeletePromotion(_id);
      return res.json({ result: true });
    } catch (error) {
      console.log(error);
    }
  }
}
