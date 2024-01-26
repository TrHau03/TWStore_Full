import { Body, Controller, Get, HttpStatus, Param, Post, Res, UseGuards } from "@nestjs/common";
import { OrderService } from "./order.service";
import { OrderInsertDTO } from "./dto/order_insert_request";
import { Response } from "express";
import { OrderGetbyIdDTO } from "./dto/order_getOrderbyID_request";
import { AuthGuard } from "src/auth/auth.guard";
@Controller('order')

export class OrderController {
    constructor(private readonly orderService: OrderService) { }
    @Post('addOrder')
    async AddOrder(@Body() body: OrderInsertDTO, @Res() res: Response) {
        try {
            const order = await this.orderService.addOrder(body);
            return res.status(HttpStatus.OK).json(order);
        } catch (error) {
            res.status(HttpStatus.BAD_REQUEST).json(error);
        }
    }
    @Get('getAllOrder')
    async GetAllOrder(@Res() res: Response) {
        try {
            const responseDTO = await this.orderService.getAllOrder();
            return res.status(HttpStatus.OK).json(responseDTO);
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json(error);
        }
    }
    @Get('getOrderByID/:_id')
    async GetOrderByID(@Param() _id: OrderGetbyIdDTO, @Res() res: Response) {

        try {

            const responseDTO = await this.orderService.getOrderbyID(_id);
            return res.status(HttpStatus.OK).json(responseDTO);
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json(error);
        }
    }
    @Get('getOrderByIdUser/:_id')
    async GetOrderByIdUser(@Param() _id: any, @Res() res: Response) {
        try {
            const responseDTO = await this.orderService.getOrderByIdUser(_id);
            return res.status(HttpStatus.OK).json(responseDTO);
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json(error);
        }
    }
}
