import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { Product } from "src/product/product.schema";

export type PromotionDocument = Promotion & Document;


@Schema()
export class Promotion {

    @Prop()
    titleVoucher : string;

    @Prop()
    contentVoucher : string;

    @Prop()
    discountCode : string;

    @Prop()
    discountLevel : number;

    @Prop()
    startDay : Date;

    @Prop()
    endDay : Date;
    
}
export const PromotionSchema = SchemaFactory.createForClass(Promotion);
