import mongoose, { Types } from "mongoose";
import { Product } from "src/product/product.schema";

export class UserCart_FavoriteDTO {
    _id: Types.ObjectId;
    _idProduct: Product;
}