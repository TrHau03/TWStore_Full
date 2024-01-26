import { Types } from "mongoose";
import { Address, ListProduct } from "./user.schema";
import { Product } from "src/product/product.schema";

export class Users {
    _id: Types.ObjectId;
    _idUser: Types.ObjectId;
    name: string;
    email: string;
    phone: string;
    active: boolean;
    avatar: string;
    cartItem: ListProduct[];
    gender: string;
    birthDay: string;
    address: Array<Address>;
}
