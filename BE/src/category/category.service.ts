import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Category, CategoryDocument } from "./category.schema";
import { Model } from "mongoose";
import { CategoryAddRequestDTO } from "./dto/category_add_request";
import { CategoryResponseDTO } from "./dto/category_response";
import { CategoryGetAllResponseDTO } from "./dto/category_getAll_response";
import { CategoryDeleteRequestDTO } from "./dto/category_delete_request";

@Injectable()
export class CategoryService {
    constructor(@InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>) { }
    async AddCategory(requestDTO: CategoryAddRequestDTO): Promise<CategoryResponseDTO> {
        try {
            const { name , linkIcon} = requestDTO;
            const category = await this.categoryModel.findOne({ name });
            if (category) {
                return {
                    status: false,
                    message: 'Category already exists',
                }
            }
            const newCategory = new this.categoryModel({ name ,linkIcon});
            await newCategory.save();
            return {
                status: true,
                message: 'Add category successfully',
            }
        } catch (error) {
            return {
                status: false,
                message: 'Add category failed',
            }
        }
    }
    async GetAllCategory(): Promise<CategoryGetAllResponseDTO[]> {
        try {
            const responseDTO = await this.categoryModel.find();
            return responseDTO;
        } catch (error) {
            return error;
        }
    }
    async DeleteCategory(requestDTO: CategoryDeleteRequestDTO): Promise<CategoryResponseDTO> {
        try {
            const { _id } = requestDTO;
            const category = await this.categoryModel.findById(_id);
            if (!category) return {
                status: false,
                message: 'Category not found',
            };
            await this.categoryModel.findByIdAndDelete(_id);
            return {
                status: true,
                message: 'Delete category successfully',
            };
        } catch (error) {
            return {
                status: false,
                message: 'Delete category failed',
            };
        }
    }
}