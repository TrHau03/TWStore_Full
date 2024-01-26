
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document, ObjectId, SchemaTypes, Types } from "mongoose";
export type UserInfoDocument = UsersInfo & Document;



@Schema()
export class UsersInfo {

    @Prop({ unique: true, required: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop()
    role: string;

    @Prop()
    username: string;



}

export const UserInfoSchema = SchemaFactory.createForClass(UsersInfo);