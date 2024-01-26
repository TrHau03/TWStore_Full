import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Render, Res, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from "@nestjs/common";
import { Response } from "express";
import { FileFieldsInterceptor, FileInterceptor } from "@nestjs/platform-express";
import { Types } from "mongoose";
import { CategoryService } from "./category.service";
import { CategoryAddRequestDTO } from "./dto/category_add_request";
import { AuthenticatedGuard } from "src/auth/authWeb.guard";

@Controller('categoriesCpanel')
export class CategoryCpanelController {
    constructor(private readonly categoryService: CategoryService) { }

    @UseGuards(AuthenticatedGuard)
    @Get('quanlytheloai')
    @Render('quanlytheloai')
    async quanlysanpham(@Res() res: Response) {
        try {
            const category = await this.categoryService.GetAllCategory();
            return { category: category };
        } catch (error) {
        }
    }
    @UseGuards(AuthenticatedGuard)
    @Get('addCategory')
    @Render('addCategory')
    async AddCategory(@Res() res: Response) {
        try {
            return {};
        } catch (error) {
            return error;
        }
    }
    @Post('addCategory')
    async addCategory(@Body() body: CategoryAddRequestDTO, @Res() res: Response) {
        try {
            await this.categoryService.AddCategory(body);
            return res.redirect('/categoriesCpanel/quanlytheloai');
        } catch (error) {
            console.log(error);
        }
    }
    @Delete('deleteCategory/:_id/delete')
    async deleteCategory(@Param() _id: Types.ObjectId, @Res() res: Response) {
        try {
            await this.categoryService.DeleteCategory(_id);
            return res.json({ result: true });
        } catch (error) {
            console.log(error);
        }
    }
}
