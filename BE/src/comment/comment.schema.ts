
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document, ObjectId, SchemaTypes, Types } from "mongoose";
export type CommentDocument = Comment & Document
@Schema()
export class Comment {
    //Các thuộc tính của product
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Users' })
    userID: Types.ObjectId;
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Product' })
    productID: Types.ObjectId;
    @Prop()
    createAt: string;
    @Prop()
    content: string;
    @Prop()
    image: Array<string>;
    @Prop()
    star: number;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);