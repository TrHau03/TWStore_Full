import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Res } from "@nestjs/common";
import { Response } from "express";
import { PaymentService } from "./payment.service";

@Controller('payment')
export class PaymentController {
    constructor(private readonly paymentService: PaymentService) { }

    @Get('getAllPaymentMethod')
    async GetAllPaymentMethod(@Res() res: Response) {
        try {
            const responseDTO = await this.paymentService.getAllPaymentMethod();
            return res.status(HttpStatus.OK).json(responseDTO);
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json(error);
        }
    }
}
