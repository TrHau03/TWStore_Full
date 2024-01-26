import { Types } from "mongoose";

export class Comment {
    userID: Types.ObjectId;
    productID: Types.ObjectId;
    createAt: string;
    content: string;
    image: Array<string>;
    star: number;
}