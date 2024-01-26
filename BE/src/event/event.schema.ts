import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { Product } from "src/product/product.schema";


export type EventDocument = Event & Document;

@Schema()
export class Event {
    @Prop()
    eventImage: string;

    @Prop()
    eventName: string;

    @Prop()
    levelGiamgia: number;

    @Prop()
    soNgayGiamgia: Date;

    @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }])
    product: Product[];

}
export const EventSchema = SchemaFactory.createForClass(Event);