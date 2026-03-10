import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

// O prefixo global 'api' aplica-se a este controller, respondendo em /api/uploads
@Controller('uploads')
export class UploadController {
  @Post()
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads', 
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        callback(null, `${uniqueSuffix}${ext}`);
      },
    }),
  }))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    // CORREÇÃO FINAL E DEFINITIVA:
    // O ServeStaticModule serve os ficheiros a partir da raiz, ignorando o prefixo /api.
    // Portanto, o URL para o ficheiro NÃO deve conter /api.
    return {
      url: `/uploads/${file.filename}`,
    };
  }
}
