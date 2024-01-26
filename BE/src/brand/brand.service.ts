import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Brand, BrandDocument } from "./brand.schema";
import { Model } from "mongoose";
import { BrandGetAllResponseDTO } from "./dto/brand_getAll_response";
import { BrandAddRequestDTO } from "./dto/brand_add_request";
import { BrandResponseDTO } from "./dto/brand_response";
import { BrandDeleteRequestDTO } from "./dto/brand_delete_request";

@Injectable()
export class BrandService {
    constructor(@InjectModel(Brand.name)
    private readonly brandModel: Model<BrandDocument>) { }
    async AddBrand(requestDTO: BrandAddRequestDTO): Promise<BrandResponseDTO> {
        try {
            const { name, linkIcon } = requestDTO;
            const Brand = await this.brandModel.findOne({ name });
            if (Brand) {
                return {
                    status: false,
                    message: 'Brand already exists',
                }
            }

            const newBrand = new this.brandModel({ name, linkIcon });
            await newBrand.save();
            return {
                status: true,
                message: 'Add Brand successfully',
            }
        } catch (error) {
            console.log(error);

            return {
                status: false,
                message: 'Add Brand failed',
            }
        }
    }
    async GetAllBrand(): Promise<BrandGetAllResponseDTO[]> {
        try {
            const responseDTO = await this.brandModel.find();
            return responseDTO;
        } catch (error) {
            return error;
        }
    }
    async DeleteBrand(requestDTO: BrandDeleteRequestDTO): Promise<BrandResponseDTO> {
        try {
            const { _id } = requestDTO;
            const Brand = await this.brandModel.findById(_id);
            if (!Brand) return {
                status: false,
                message: 'Brand not found',
            };
            await this.brandModel.findByIdAndDelete(_id);
            return {
                status: true,
                message: 'Delete Brand successfully',
            }
        } catch (error) {
            return {
                status: false,
                message: 'Delete Brand failed',
            }
        }
    }
}