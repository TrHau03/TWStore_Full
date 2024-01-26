import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Res, UseGuards } from "@nestjs/common";
import { ProductService } from "./product.service";
import { ProductInsertDTO } from "./dto/product_insert_request";
import { ProductUpdateDTO } from "./dto/product_update_request";
import { Response } from "express";
import { ProductGetbyIdDTO } from "./dto/product_getProductbyID_request";
import { ProductGetByIdCategoryRequestDTO } from "./dto/product_getProductbyIdCategory_request";
import { ProductGetByIdPromotionRequestDTO } from "./dto/product_getProductbyIdPromotion_request";
import { Product } from "./product.schema";
import { AuthGuard } from "src/auth/auth.guard";

@Controller('product')

export class ProductController {
    constructor(private readonly productService: ProductService) { }

    @Get('getAllProduct')
    async GetAllProduct(@Res() res: Response) {
        try {
            const product = await this.productService.getAllProduct();
            return res.status(HttpStatus.OK).json(product);
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json(error);
        }
    }
    
    @Get('getProductById/:_id')
    async GetProductById(@Param() _id: ProductGetbyIdDTO, @Res() res: Response) {
        try {
            const product = await this.productService.getProductById(_id);
            return res.status(HttpStatus.OK).json(product);
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json(error);
        }
    }

    @Get('getProductByIdCategory/:_id')
    async GetProductByIdCategory(@Param() _id: ProductGetByIdCategoryRequestDTO, @Res() res: Response) {
        try {
            const product = await this.productService.getProductbyIdCategory(_id);
            return res.status(HttpStatus.OK).json(product);
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json(error);
        }
    }

    @Get('getProductByIdBrand/:_id')
    async GetProductByIdBrand(@Param() params: any, @Res() res: Response) {
        try {
            const product = await this.productService.getProductbyIdBrand(params);
            return res.status(HttpStatus.OK).json(product);
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json(error);
        }
    }
    @Put('updateQuantityProduct/:id')
    async updateQuantityProduct(@Param('id') _id: string, @Body() body: any, @Res() res: Response) {
        try {
            const product = await this.productService.updateProduct({ _id, body });
            return res.status(HttpStatus.OK).json(product);
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json(error);
        }
    }
    @Get('getRecommendProduct')
    async getRecommendProduct(@Res() res: Response) {
        try {
            const product = await this.productService.getRecommendProduct();
            return res.status(HttpStatus.OK).json(product);
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json(error);
        }
    }
}