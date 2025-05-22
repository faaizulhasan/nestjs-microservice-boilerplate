import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {BadRequestException, ValidationError, ValidationPipe} from "@nestjs/common";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            exceptionFactory: (validationErrors: ValidationError[] = []) => {
                // Flatten all messages
                const errors = validationErrors
                    .map((error) => Object.values(error.constraints || {}))
                    .flat();

                return new BadRequestException(errors[0]);
            },
        }),
    );
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
