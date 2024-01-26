import { Types } from "mongoose";
import { Brand } from "src/brand/brand.schema";
import { Category } from "src/category/category.schema";
import { Color } from "src/colorProduct/color.schema";
import { Size } from "src/size/size.schema";

export class Product {
    image: Array<string>;
    productName: string;
    price: number;
    quantity: number;
    description: string;
    offer: number;
    brand: Brand;
    size: Size[];
    categoryID: Category;
    colorID: Color[];
}