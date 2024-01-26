import { Product } from "src/product/product.schema";
import { Types } from "mongoose";

export class Event {
    _id: Types.ObjectId;
    eventImage: string;
    eventName: string;
    levelGiamgia: number;
    soNgayGiamgia: Date;
    product: Array<Product>;

}

