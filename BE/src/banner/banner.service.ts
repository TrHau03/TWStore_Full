import { InjectModel } from "@nestjs/mongoose";
import { Banner, BannerDocument } from "./banner.schema";
import { Model, Types } from "mongoose";
import { BannerInsertDTO } from "./dto/banner_insert_request";
import { BannerResponseDTO } from "./dto/banner_response";
import { Injectable } from "@nestjs/common";
import uploadImage from "src/upload/upload";

@Injectable()
export class BannerService {
    constructor(
        @InjectModel(Banner.name)
        private readonly bannerModel: Model<BannerDocument>,
    ) { }

    async addBanner(requestDTO: any): Promise<BannerResponseDTO> {
        try {
            const body: BannerInsertDTO = requestDTO.body;
            const files = requestDTO.files;
            const url = await uploadImage(files, "Banner");
            const { title } = body;
            const banner = new this.bannerModel({ title, image: url });
            await banner.save()
            return {
                status: true,
                message: 'Insert banner success' + banner,
            };

        } catch (error) {
            console.log(error);
            return {
                status: false,
                message: 'Update address failed',
            }
        }
    }
    async getAllBanner(): Promise<BannerResponseDTO | any> {
        try {
            const banner = await this.bannerModel.find();
            return {
                status: true,
                message: 'Get all banner success',
                banner
            }
        } catch (error) {
            console.log(error);
            return {
                status: false,
                message: 'Get all banner failed',
            }
        }
    }
    async deleteBanner(id: Types.ObjectId): Promise<BannerResponseDTO> {
        try {
            const { _id } = id;

            await this.bannerModel.findByIdAndDelete(_id);
            return {
                status: true,
                message: 'Delete banner success',
            }
        } catch (error) {
            console.log(error);
            return {
                status: false,
                message: 'Delete banner failed',
            }
        }
    }
}