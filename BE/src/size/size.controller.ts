import { Body, Controller, Get, HttpStatus, Param, Post, Res } from "@nestjs/common";
import { SizeService } from "./size.service";
import { Response } from "express";
import { SizeAddRequestDTO } from "./dto/size_add_request";
import { SizeDeleteRequestDTO } from "./dto/size_delete_request";

@Controller('Size')
export class SizeController {
    constructor(private readonly sizeService: SizeService) { }

   

    @Get('getAllSize')
    async GetAllSize(@Res() res: Response) {
        try {
            const responseDTO = await this.sizeService.GetAllSize();
            return res.status(HttpStatus.OK).json(responseDTO);
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json(error);

        }
    }
    

    

}