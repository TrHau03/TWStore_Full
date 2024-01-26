import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderDocument, listProduct } from './order.schema';
import { Model, Types } from 'mongoose';
import { OrderInsertDTO } from './dto/order_insert_request';
import { OrderResponseDTO } from './dto/order_response';
import { OrderGetResponseDTO } from './dto/order_get_response';
import { OrderGetbyIdDTO } from './dto/order_getOrderbyID_request';
import { log } from 'console';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name)
    private readonly orderModel: Model<OrderDocument>,
  ) { }
  async addOrder(requestDTO: OrderInsertDTO): Promise<OrderResponseDTO> {
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    try {
      const {
        orderCode = Math.floor(Math.random() * (999999 - 100000)) + 100000,
        status = 1,
        listProduct,
        bookingDate = date,
        deliveryDate = `${day + 5}/${month}/${year}`,
        userID,
        voucher,
        phoneReceiver,
        nameReceiver,
        addressDelivery,
        payment,
        totalPrice
      } = requestDTO;
      const newOrder = new this.orderModel({
        orderCode,
        status,
        listProduct,
        bookingDate,
        deliveryDate,
        userID,
        voucher,
        phoneReceiver,
        nameReceiver,
        addressDelivery,
        payment,
        totalPrice,
      });

      await newOrder.save();
      return {
        status: true,
        message: 'Add order successfully',
      };
    } catch (error) {
      console.log(error);

      return {
        status: false,
        message: 'Add order failed',
      };
    }
  }
  async getAllOrder(): Promise<OrderResponseDTO | any> {
    try {
      const order = await this.orderModel
        .find()
        .populate([
          { path: 'listProduct', populate: { path: 'productID' } },
          { path: 'userID' },
        ]).sort([['orderCode', 'desc']]);
      return order;
    } catch (error) {
      console.log(error);
      return {
        status: false,
        message: 'Get all banner failed',
      };
    }
  }
  async getOrderbyID(requestDTO: OrderGetbyIdDTO): Promise<OrderGetResponseDTO> {
    try {
      const _id = requestDTO;
      const order = await this.orderModel.findById(_id).populate([
        {
          path: 'listProduct',
          populate: [
            {
              path: 'productID',
              model: 'Product',
              select: ['productName', 'price', 'name', 'image'],
            },
            { path: 'colorID', model: 'Color', select: 'name' },
            { path: 'sizeID', model: 'Size', select: 'name' },
          ],
        },
      ]);
      return order;
    } catch (error) {
      console.log(error);
    }
  }
  async getOrderbyIDUser(requestDTO: OrderGetbyIdDTO): Promise<OrderGetResponseDTO[]> {
    try {
      const _id = requestDTO;
      const order = await this.orderModel.find({ userID: _id }).populate([
        {
          path: 'listProduct',
          populate: [{
            path: 'productID',
            model: 'Product',
            select: ['productName', 'price']
          },
          ],
        },


        { path: 'userID' },
      ]);
      return order;
    } catch (error) {
      console.log(error);
    }
  }
  async updateStatusOrder(requestDTO: { id: string, body: any }): Promise<OrderResponseDTO | any> {
    try {
      const { id } = requestDTO;
      const { status } = requestDTO.body
      const order = await this.orderModel.findById(id);
      if (!order) {
        throw new NotFoundException('Order not found');
      }
      order.status = status;
      await order.save();
      return {
        status: true,
        message: 'Update status for Order successfully',
        userID: order.userID,
        statusOrder: order.status,
      };
    } catch (error) {
      console.log(error);
      return {
        status: false,
        message: 'Update status for Order failed',
      };
    }
  }
  async getOrderByIdUser(requestDTO: any): Promise<OrderGetResponseDTO[]> {
    try {
      const { _id } = requestDTO;
      const order = await this.orderModel.find({ userID: _id }).populate([
        {
          path: 'listProduct',
          populate: [
            {
              path: 'productID',
              model: 'Product',
              select: ['productName', 'price'],
            },
            { path: 'colorID', model: 'Color', select: 'name' },
            { path: 'sizeID', model: 'Size', select: 'name' },
          ],
        },
      ]);
      return order;
    } catch (error) {
      return;
    }
  }
  async getMonthlyRevenue(year: number, month: number): Promise<number> {
    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);
    const result = await this.orderModel.aggregate([
      {
        $match: {
          bookingDate: {
            $gte: startOfMonth,
            $lte: endOfMonth,
          },
          status: {
            $eq: 5
          }
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalPrice' },
        },
      },
    ]);
    return result.length > 0 ? result[0].totalRevenue : 0;
  }
  async getAnnualRevenue(year: number): Promise<number[]> {
    const monthlyRevenues = [];

    for (let month = 1; month <= 12; month++) {
      const totalRevenue = await this.getMonthlyRevenue(year, month);
      monthlyRevenues.push(totalRevenue);
    }

    return monthlyRevenues;
  }
  async top10ProductBestSaler(): Promise<[]> {
    const orders = await this.orderModel.find().populate([
      {
        path: 'listProduct',
        populate: [
          {
            path: 'productID',
            model: 'Product',
            select: ['productName', 'price'],
          },
        ],
      }
    ]);
    const listTopProduct: { id: string, productName: string, quantity: number } | any = [];
    orders.map((item: any) => {
      item.listProduct.map((item: any) => {
        const listID = listTopProduct.map((itemList: any) => {
          return itemList.id;
        });
        if (!listID.includes(item.productID._id)) {
          listTopProduct.push({
            id: item.productID._id,
            productName: item.productID.productName,
            quantity: item.quantityProduct
          })
        } else {
          listTopProduct.map((itemList: any) => {
            if (itemList.id == item.productID._id) {
              itemList.quantity += item.quantityProduct;
            }
          })
        }
      });
    })
    return listTopProduct.sort((a, b) => b.quantity - a.quantity).slice(0, 10);;
  }
}
