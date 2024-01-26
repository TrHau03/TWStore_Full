
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document, ObjectId, SchemaTypes, Types } from "mongoose";
import { Color } from "src/colorProduct/color.schema";
import { Product } from "src/product/product.schema";
import { Promotion } from "src/promotion/promotion.schema";
import { Size } from "src/size/size.schema";
import { Users } from "src/user/user.schema";
export type OrderDocument = Order & Document;


export class PaymentDetail {
    @Prop()
    paymentMethods: string;

    @Prop()
    status: number;

}
export class listProduct {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Product' })
    productID: Product;

    @Prop()
    quantityProduct: number;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Color' })
    colorID: Color;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Size' })
    sizeID: Size;
}
@Schema()
export class Order {
    @Prop()
    orderCode: string;

    @Prop({ type: Number, default: 1 }) 
    status: number;

    @Prop()
    listProduct: listProduct[];

    @Prop()
    bookingDate: Date;

    @Prop()
    deliveryDate: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Users' })
    userID: Users;

    @Prop()
    voucher: string;

    @Prop()
    phoneReceiver: string;

    @Prop()
    nameReceiver: string;

    @Prop()
    addressDelivery: string;

    @Prop()
    payment: PaymentDetail | null;

    @Prop()
    totalPrice: number;

}

export const OrderSchema = SchemaFactory.createForClass(Order);