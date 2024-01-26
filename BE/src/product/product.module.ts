import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Product, ProductSchema } from "./product.schema";
import { ProductController } from "./product.controller";
import { ProductService } from "./product.service";
import { Category, CategorySchema } from "src/category/category.schema";
import { ProductsCpanelController } from "./product.cpanel.controller";
import { CategoryService } from "src/category/category.service";
import { CategoryController } from "src/category/category.controller";
import { CategoryModule } from "src/category/category.module";
import { ColorModule } from "src/colorProduct/color.module";
import { SizeModule } from "src/size/size.module";
import { BrandModule } from "src/brand/brand.module";





@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Product.name, schema: ProductSchema },
        ]),
        CategoryModule, ColorModule, SizeModule, BrandModule
    ],
    
    controllers: [ProductController, ProductsCpanelController],
    providers: [ProductService],
    exports: [ProductService]

})
export class ProductModule { }