import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.enableCors({
        origin: "http://localhost:8080", // This allows requests only from 'http://localhost:8080'
    });

    const config = new DocumentBuilder()
        .setTitle("Pipeline API")
        .setDescription("Pipeline API description")
        .setVersion("1.0")
        .addTag("pipeline")
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("swagger", app, document);

    await app.listen(3000);
}
bootstrap();
