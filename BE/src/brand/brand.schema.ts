
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document, ObjectId, SchemaTypes, Types } from "mongoose";
export type BrandDocument = Brand & Document;
@Schema()
export class Brand {
    //Các thuộc tính của product
    @Prop()
    name: string;
    @Prop()
    linkIcon: string;
}

export const BrandSchema = SchemaFactory.createForClass(Brand);