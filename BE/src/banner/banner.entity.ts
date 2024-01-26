import { Types } from "mongoose";

export class Banner {
    _id: Types.ObjectId;
    title: string;
    image: string;
}