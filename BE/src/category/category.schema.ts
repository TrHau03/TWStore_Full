
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document, ObjectId, SchemaTypes, Types } from "mongoose";
export type CategoryDocument = Category & Document
@Schema()
export class Category {
    @Prop()
    name: string;
    @Prop()
    linkIcon: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);