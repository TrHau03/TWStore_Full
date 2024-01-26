import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
} from '@nestjs/common';

import { Response } from 'express';
import { NotificationService } from './notifi.service';

@Controller('notifications')
export class NotificationController {
  constructor(
    private readonly NotificationService: NotificationService,

  ) {}

  @Get('getAllNotification/:id')
  async getAllNotification(@Param('id') _idUser : any ,@Res() res: Response) {
    try {
      const notifi = await this.NotificationService.getAllNotification(_idUser);
      return res.status(HttpStatus.OK).json(notifi);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json(error);
    }
  }

}
