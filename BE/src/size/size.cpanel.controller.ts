import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Render, Res, UseGuards } from "@nestjs/common";
import { SizeService } from "./size.service";
import { Response } from 'express';
import { SizeDeleteRequestDTO } from "./dto/size_delete_request";
import { SizeAddRequestDTO } from "./dto/size_add_request";
import { AuthenticatedGuard } from "src/auth/authWeb.guard";
@Controller('sizesCpanel')
export class SizesCpanelController {
  constructor(
    private readonly sizeService: SizeService
  ) { }
  @UseGuards(AuthenticatedGuard)
  @Get('quanlykichco')
  @Render('quanlykichco')
  async quanlykichco(@Res() res: Response) {
    try {
      const sizes = await this.sizeService.GetAllSize();
      return { sizes };
    } catch (error) {

    }
  }
  @UseGuards(AuthenticatedGuard)
  @Get('addSize')
  @Render('addSize')
  async AddSizeRender(@Res() res: Response) {
    try {
      const sizes = await this.sizeService.GetAllSize();
      return { sizes };
    } catch (error) {

    }
  }
  @Post('addSize')
  async AddSize(@Body() body: SizeAddRequestDTO, @Res() res: Response) {
    try {
      const responseDTO = await this.sizeService.AddSize(body);
      return res.redirect('/sizesCpanel/quanlykichco')
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json(error);

    }
  }

  @Delete('deleteSize/:id/delete')
  async DeleteSize(@Param() id: SizeDeleteRequestDTO, @Res() res: Response) {
    try {
      const responseDTO = await this.sizeService.DeleteSize(id);
      return res.json({ result: true });
    } catch (error) {
      return res.json({ result: false });
    }
  }
}