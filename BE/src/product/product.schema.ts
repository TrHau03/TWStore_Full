import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { SchemaTypes, Types } from "mongoose";
import { Brand } from "src/brand/brand.schema";
import { Category } from "src/category/category.schema";
import { Color } from "src/colorProduct/color.schema";
import { Promotion } from "src/promotion/promotion.schema";
import { Size } from "src/size/size.schema";
import { Users } from "src/user/user.schema";

export type ProductDocument = Product & Document;


@Schema()
export class Product {
    @Prop()
    image: Array<string>;

    @Prop({ required: true })
    productName: string;

    @Prop()
    price: number;

    @Prop()
    quantity: number;

    @Prop()
    description: string;

    @Prop()
    offer: number;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Brand' })
    brand: Brand;

    @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Size' }])
    size: Size[];
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Category' })
    categoryID: Category;
    @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Color' }])
    colorID: Color[];
    
}
export const ProductSchema = SchemaFactory.createForClass(Product);
