import { Body, Controller, Delete, Get, Inject, Patch, Post, Request, UseGuards, Param, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { extname } from "path";
import { diskStorage } from "multer";
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';

@Controller('media')
export class MediaProxyController {
  constructor() { }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, callback) => {
          const path = req.query.path || "media";
          const uploadPath = `./src/uploads/${path}`;
          if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
          }
          callback(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const ext = extname(file.originalname);
          cb(null, `${uuidv4()}${ext}`);
        },
      }),
    }),
  )
  uploadFile(@Request() req, @UploadedFile() file: Express.Multer.File) {
    const path = req.query.path || "media";
    return {
      statusCode: 200,
      status: true,
      message: 'File uploaded successfully',
      data: {
        filename: file.filename,
        path: `${path}/${file.filename}`,
      }
    }
  }
}