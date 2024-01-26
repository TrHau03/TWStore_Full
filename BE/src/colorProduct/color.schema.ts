
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document, ObjectId, SchemaTypes, Types } from "mongoose";
export type ColorDocument = Color & Document;
@Schema()
export class Color {
    //Các thuộc tính của product
    @Prop()
    name: string;

    @Prop()
    code: string;
}

export const ColorSchema = SchemaFactory.createForClass(Color);