import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Render, Res, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from "@nestjs/common";
import { Response } from "express";
import { FileFieldsInterceptor, FileInterceptor } from "@nestjs/platform-express";
import { Types } from "mongoose";
import { PaymentService } from "./payment.service";
import { AuthenticatedGuard } from "src/auth/authWeb.guard";

@Controller('paymentCpanel')
export class PaymentCpanelController {
    constructor(private readonly paymentService: PaymentService) { }
    @UseGuards(AuthenticatedGuard)
    @Get('quanlythanhtoan')
    @Render('quanlythanhtoan')
    async quanlyPaymentMethod(@Res() res: Response) {
        try {
            const payment = await this.paymentService.getAllPaymentMethod();

            return { payment: payment.data };
        } catch (error) {
        }
    }
    @UseGuards(AuthenticatedGuard)
    @Get('addPaymentMethod')
    @Render('addPaymentMethod')
    async AddPaymentRender(@Res() res: Response) {
        try {
            return {};
        } catch (error) {
            return error;
        }
    }
    @Post('addPaymentMethod')
    async addPaymentMethod(@Body() body: any, @Res() res: Response) {
        try {
            await this.paymentService.addPaymentMethod(body);

            return res.redirect('/paymentCpanel/quanlythanhtoan');
        } catch (error) {
            console.log(error);
        }
    }
    @Delete('deletePayment/:id')
    async deletePayment(@Param() _id: Types.ObjectId, @Res() res: Response) {
        try {
            const { id } = _id;
            await this.paymentService.deletePaymentMethod(id);
            return res.json({ result: true });
        } catch (error) {
            console.log(error);
        }
    }
}
