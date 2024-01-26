import { Body, Controller, Get, HttpStatus, Post, Res } from "@nestjs/common";
import { CategoryService } from "./category.service";
import { CategoryAddRequestDTO } from "./dto/category_add_request";
import { Response } from "express";
import { CategoryDeleteRequestDTO } from "./dto/category_delete_request";

@Controller('category')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) { }

    @Get('getAllCategory')
    async GetAllCategory(@Res() res: any) {
        try {
            const responseDTO = await this.categoryService.GetAllCategory();
            return res.status(HttpStatus.OK).json(responseDTO);
        } catch (error) {
            return res.status(HttpStatus.OK).json(error);
        }
    }
}