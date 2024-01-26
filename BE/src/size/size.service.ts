import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Size, SizeDocument } from "./size.schema";
import { Model } from "mongoose";
import { SizeGetAllResponseDTO } from "./dto/size_getAll_response";
import { SizeAddRequestDTO } from "./dto/size_add_request";
import { SizeResponseDTO } from "./dto/size_response";
import { SizeDeleteRequestDTO } from "./dto/size_delete_request";

@Injectable()
export class SizeService {
    constructor(@InjectModel(Size.name)
    private readonly sizeModel: Model<SizeDocument>) { }
    async AddSize(requestDTO: SizeAddRequestDTO): Promise<SizeResponseDTO> {
        try {
            const { name } = requestDTO;
            const size = await this.sizeModel.findOne({ name });
            if (size) {
                return {
                    status: false,
                    message: 'Size already exists',
                }
            }
            const newSize = new this.sizeModel({ name });
            await newSize.save();
            return {
                status: true,
                message: 'Add Size successfully',
            }
        } catch (error) {
            console.log(error);

            return {
                status: false,
                message: 'Add Size failed',
            }
        }
    }
    async GetAllSize(): Promise<SizeGetAllResponseDTO[]> {
        try {
            const responseDTO = await this.sizeModel.find();
            return responseDTO;
        } catch (error) {
            return error;
        }
    }
    async DeleteSize(requestDTO: SizeDeleteRequestDTO): Promise<SizeResponseDTO> {
        try {
            const { id } = requestDTO;
            const Size = await this.sizeModel.findById(id);
            if (!Size) return {
                status: false,
                message: 'Size not found',
            };
            await this.sizeModel.findByIdAndDelete(id);
            return {
                status: true,
                message: 'Delete Size successfully',
            }
        } catch (error) {
            return {
                status: false,
                message: 'Delete Size failed',
            }
        }
    }



}