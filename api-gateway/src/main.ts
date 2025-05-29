import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, RequestMethod, ValidationError, ValidationPipe } from "@nestjs/common";
import { GlobalExceptionFilter } from './global-exception-handler';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';


async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    app.useStaticAssets(join(__dirname,'uploads'));
    app.setBaseViewsDir(join(__dirname, 'views'));
    app.setViewEngine('hbs');

    app.setGlobalPrefix('api/v1',{
        exclude: [
            { path: 'webhook/(.*)', method: RequestMethod.ALL }
          ],
    });
    app.useGlobalFilters(new GlobalExceptionFilter());

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            exceptionFactory: (validationErrors: ValidationError[] = []) => {
                // Flatten all messages
                const errors = validationErrors
                    .map((error) => Object.values(error.constraints || {}))
                    .flat();
                console.log("errors:", errors);
                return new BadRequestException(errors[0]);
            },
        }),
    );
        
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
