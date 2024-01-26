
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document, ObjectId, SchemaTypes, Types } from "mongoose";
import { Color } from "src/colorProduct/color.schema";
import { Product } from "src/product/product.schema";
import { Size } from "src/size/size.schema";
export type UserDocument = Users & Document;


export class Address {
    @Prop()
    position: number;

    @Prop()
    city: string;

    @Prop()
    district: string;

    @Prop()
    ward: string;

    @Prop()
    street: string;
}
export class ListProduct {
    @Prop()
    key: string;
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Product' })
    productID: Product;
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Size' })
    sizeProduct: Size;
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Color' })
    colorProduct: Color;
    @Prop()
    quantity: number;
}
@Schema()
export class Users {

    @Prop({ type: mongoose.Schema.Types.ObjectId })
    _idUser: Types.ObjectId;

    @Prop()
    name: string;

    @Prop()
    email: string;

    @Prop()
    phone: string;

    @Prop()
    active: boolean;

    @Prop()
    avatar: string;

    @Prop()
    cartItem: ListProduct[];

    @Prop()
    gender: string;

    @Prop()
    birthDay: string;

    @Prop()
    address: Address[] | null;




}

export const UserSchema = SchemaFactory.createForClass(Users);