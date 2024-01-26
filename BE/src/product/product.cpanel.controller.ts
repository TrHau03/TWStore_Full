import { Product } from './product.schema';

import { CategoryController } from './../category/category.controller';

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Render,
  Req,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { Request, Response } from 'express';
import { CategoryService } from 'src/category/category.service';
import { CategoryGetAllResponseDTO } from 'src/category/dto/category_getAll_response';
import { ColorService } from 'src/colorProduct/color.service';
import { SizeService } from 'src/size/size.service';
import { BrandService } from 'src/brand/brand.service';
import { ProductGetbyIdDTO } from './dto/product_getProductbyID_request';
import { AnyFilesInterceptor, FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { ProductUpdateDTO } from './dto/product_update_request';
import { AuthGuard } from 'src/auth/auth.guard';
import { AuthenticatedGuard } from 'src/auth/authWeb.guard';

@Controller('productsCpanel')
export class ProductsCpanelController {
  constructor(
    private readonly productService: ProductService,
    private readonly categoryService: CategoryService,
    private readonly colorService: ColorService,
    private readonly sizeService: SizeService,
    private readonly brandService: BrandService
  ) { }
  @UseGuards(AuthenticatedGuard)
  @Get('addProduct')
  @Render('addProduct')
  async addProductCpanel(@Res() res: Response) {
    try {
      const categories = await this.categoryService.GetAllCategory();
      const colors = await this.colorService.GetAllColor();
      const sizes = await this.sizeService.GetAllSize();
      const brands = await this.brandService.GetAllBrand();
      return { categories, colors, sizes, brands };
    } catch (error) {

    }
  }
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'image', maxCount: 10 },
  ]))
  @Post('addProduct')
  async addProduct(@Body() body: any, @UploadedFiles() files: { image?: Express.Multer.File[] }, @Res() res: Response) {
    try {
      if (!files) {
        return null;
      }
      const product = await this.productService.addProduct({ body, files });
      return res.redirect('/productsCpanel/quanlysanpham');
    } catch (error) {
      console.log(error);
    }
  }

  @UseGuards(AuthenticatedGuard)
  @Get('productDetail/:_id/edit')
  @Render('productDetail')
  async productDetail(@Param() _id: ProductGetbyIdDTO, @Res() res: Response) {
    try {
      let product: any = await this.productService.getProductById(_id);
      let categories = await this.categoryService.GetAllCategory();
      let colors = await this.colorService.GetAllColor();
      let sizes = await this.sizeService.GetAllSize();
      let brands = await this.brandService.GetAllBrand();
      brands = brands.map((item: any) => {
        item.selected = false;
        if (item._id.toString() == product.brand._id.toString()) {
          item.selected = true;
        }
        return item;
      });
      colors = colors.map((item: any) => {
        item.selected = false;
        product.colorID.map((color) => {
          if (item._id.toString() == color._id.toString()) {
            item.selected = true;
          }
        })
        return item;
      });
      categories = categories.map((item: any) => {
        item.selected = false;
        if (item._id.toString() == product.categoryID?._id?.toString()) {
          item.selected = true;
        }
        return item;
      });
      sizes = sizes.map((item: any) => {
        item.selected = false;
        product.size.map((size: any) => {
          if (item._id.toString() == size._id.toString()) {
            item.selected = true;
          }
        })
        return item;
      });
      return { product, categories, colors, sizes, brands, imageProduct: product.image };
    } catch (error) {
      console.log(error);
    }
  }
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'image', maxCount: 10 },
  ]))
  @Post('productDetail/:_id/edit')
  async editProduct(@Param() _id: ProductGetbyIdDTO, @Body() body: ProductUpdateDTO, @UploadedFiles() files: { image?: Express.Multer.File[] }, @Res() res: Response,
  ) {
    try {

      const result = await this.productService.updateProduct({ _id, body, files });
      if (result) {
        return res.redirect('/productsCpanel/quanlysanpham');
      }
    } catch (error) { }
  }
  @Delete('productDetail/:_id/delete')
  async deleteProduct(@Param() _id: ProductUpdateDTO, @Res() res: Response,) {
    try {

      const result = await this.productService.deleteProduct(_id);
      return res.json({ result });
    } catch (error) {
      return res.json({ result: false });
    }
  }

  @UseGuards(AuthenticatedGuard)
  @Get('quanlysanpham')
  @Render('quanlysanpham')
  async quanlysanpham(@Req() request: Request, @Res() res: Response) {
    try {
      const products = await this.productService.getAllProduct();
      const productUpdate = products.map((item: any) => {
        const price = item.price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        let parts = price.toString().split('.');
        return {
          products: item,
          price: parts[0]
        };
      });
      return { productUpdate };
    } catch (error) {

    }
  }


}













