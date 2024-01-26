 import { Types } from "mongoose";
import { Product } from "../product.entity";

export class ProductUpdateDTO extends Product{
    _id: string;
}