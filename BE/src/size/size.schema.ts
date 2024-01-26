
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document, ObjectId, SchemaTypes, Types } from "mongoose";
import { Category } from "src/category/category.schema";
export type SizeDocument = Size & Document;
@Schema()
export class Size {
    //Các thuộc tính của product
    @Prop()
    name: string;
}

export const SizeSchema = SchemaFactory.createForClass(Size);