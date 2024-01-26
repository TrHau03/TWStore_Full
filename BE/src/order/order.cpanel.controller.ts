import { Body, Controller, Get, Param, Put, Render, Res, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { Response } from 'express';
import { OrderGetbyIdDTO } from './dto/order_getOrderbyID_request';
import { PromotionService } from 'src/promotion/promotion.service';
import { AuthenticatedGuard } from 'src/auth/authWeb.guard';
@Controller('ordersCpanel')
export class OrderCpanelController {
  constructor(
    private readonly orderService: OrderService,
    private readonly promotionService: PromotionService
  ) { }
  @UseGuards(AuthenticatedGuard)
  @Get('quanlydonhang')
  @Render('quanlydonhang')
  async quanlydonhang(@Res() res: Response) {
    try {
      const ContentStatus = [
        {
          key: 1, value: "Đặt hàng thành công",
        },
        {
          key: 2, value: "Đã xác nhận đơn hàng"
        },
        {
          key: 3, value: "Đã đóng gói đơn hàng"
        },
        {
          key: 4, value: "Đã giao cho bên vận chuyển"
        },
        {
          key: 5, value: "Giao hàng thành công"
        },
        {
          key: 6, value: "Đơn hàng bị hủy"
        },
      ]
      const response = await this.orderService.getAllOrder();
      const orders = response.map((item: any) => {
        return {
          order: item,
          statusOrder: ContentStatus.find((status: any) => status.key == item.status)
        }
      });
      console.log(orders);
      return { orders };
    } catch (error) { }
  }
  @UseGuards(AuthenticatedGuard)
  @Get('orderDetail/:_id')
  @Render('orderDetail')
  async orderDetail(@Param() _id: OrderGetbyIdDTO, @Res() res: Response) {
    try {
      const orders = await this.orderService.getOrderbyID(_id);

      return { orders, listProduct: orders.listProduct, discountLevel: orders.voucher };
    } catch (error) { }
  }

  @Put('updateStatusOrder/:id')
  async updateStatusOrder(@Param('id') id: string, @Body() body: any, @Res() res: Response) {
    try {
      const order = await this.orderService.updateStatusOrder({ id, body });
      
      return res.json({ result: true, userID: order.userID, statusOrder: order.statusOrder });
    } catch (error) {
    }
  }



  @Get('/RevenueByYear/:year')
  async getYearRevenue(@Param('year') year: number): Promise<number[]> {
    return await this.orderService.getAnnualRevenue(year);
  }
  @Get('/RevenueByMonth')
  async getMonthlyRevenue(): Promise<number> {
    const date = new Date();
    return await this.orderService.getMonthlyRevenue(date.getFullYear(), date.getMonth() + 1);
  }

  @Get('/getTop10Product')
  async top10ProductBestSaler() {
    return await this.orderService.top10ProductBestSaler();
  }
}
