import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Render,
  Res,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { Types } from 'mongoose';
import { NotificationService } from './notifi.service';

@Controller('notifiCpanel')
export class NotificationCpanelController {
  constructor(private readonly notifiService: NotificationService) {}

  @Post('addNotification')
  async addNotification(@Body() body: any, @Res() res: Response) {
    try {
      const notification = await this.notifiService.addNotification( body );
      return res.status(HttpStatus.OK).json(notification);
    } catch (error) {
      console.log(error);
    }
  }

}
