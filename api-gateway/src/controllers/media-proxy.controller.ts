import { Body, Controller, Delete, Get, Inject, Patch, Post, Request, UseGuards, Param, UploadedFile, UseInterceptors, Query } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { extname } from "path";
import { diskStorage } from "multer";
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ConfigService } from '@nestjs/config';
@Controller('media')
export class MediaProxyController {
  constructor(private configService: ConfigService) { }

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
  @Get('presign')
  async getPresignedUrl(@Query('filename') filename: string, @Query('content_type') content_type: string, @Query('path') path: string = 'media') {
    const s3Client = new S3Client({
      region: this.configService.get<string>('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID') as string,
        secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY') as string,
      }
    });

    const command = new PutObjectCommand({
      Bucket: this.configService.get<string>('AWS_S3_BUCKET'),
      Key: filename,
      ContentType: content_type
    });

    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

    return {
      statusCode: 200,
      status: true,
      message: 'Presigned URL generated',
      data: {
        url: signedUrl,
        key: filename
      }
    };
  }
  @Get('get-file-url')
  async getFile(@Query('filename') filename: string) {
    const s3Client = new S3Client({
      region: this.configService.get<string>('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID') as string,
        secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY') as string,
      }
    });
    const command = new GetObjectCommand({
      Bucket: this.configService.get<string>('AWS_S3_BUCKET'),
      Key: filename
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn: 300 });
    return {
      statusCode: 200,
      status: true,
      message: 'File URL generated',
      data: {url}
    }
  }
}