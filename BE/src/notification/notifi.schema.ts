import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import Document, { Types } from "mongoose";


export type NotificationDocument = Notification & Document;

@Schema()
export class Notification {
    @Prop()
    _idUser: string;

    @Prop()
    title: string;

    @Prop()
    content: string;


}
export const NotificationSchema = SchemaFactory.createForClass(Notification);