import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationError, ValidationPipe } from "@nestjs/common";
import { GlobalExceptionFilter } from './global-exception-handler';


async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix('api/v1');
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
