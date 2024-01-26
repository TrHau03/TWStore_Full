import { Body, Controller, Delete, Get, Param, Post, Render, Res, UseGuards } from "@nestjs/common";
import { BrandService } from "./brand.service";
import { Response } from 'express';
import { BrandDeleteRequestDTO } from "./dto/brand_delete_request";
import { BrandAddRequestDTO } from "./dto/brand_add_request";
import { AuthenticatedGuard } from "src/auth/authWeb.guard";
@Controller('brandsCpanel')
export class BrandsCpanelController {
  constructor(
    private readonly brandService: BrandService
  ) { }
  @UseGuards(AuthenticatedGuard)
  @Get('addBrand')
  @Render('addBrand')
  async AddBrand(@Res() res: Response) {
    try {
      return {};
    } catch (error) {
      return error;
    }
  }
  @Post('addBrand')
  async addBrand(requestDTO: BrandAddRequestDTO, @Body() body: any, @Res() res: Response) {
    try {
      await this.brandService.AddBrand(body);
      return res.redirect('/brandsCpanel/quanlythuonghieu');
    } catch (error) {
      console.log(error);
    }
  }
  @UseGuards(AuthenticatedGuard)
  @Get('quanlythuonghieu')
  @Render('quanlythuonghieu')
  async quanlythuonghieu(@Res() res: Response) {
    try {
      const brands = await this.brandService.GetAllBrand();
      return { brands };
    } catch (error) {

    }
  }

  @Delete('quanlythuonghieu/:_id/delete')
  async deleteBrand(@Param() _id: BrandDeleteRequestDTO, @Res() res: Response,) {
    try {

      const result = await this.brandService.DeleteBrand(_id);
      return res.json({ result });
    } catch (error) {
      return res.json({ result: false });
    }
  }
}