import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { SecuritySchemeObject } from "@nestjs/swagger/dist/interfaces/open-api-spec.interface";

export function initSwagger(app: INestApplication) {
    const document = new DocumentBuilder()
    .setTitle("authorization-nest.js")
    .setDescription("the backend of authorization with nest.js")
    .addBearerAuth(bearerAuthOptions(), "Authorization")
    .build();
    const makeDocument = SwaggerModule.createDocument(app, document);
    SwaggerModule.setup("/swagger", app, makeDocument);
}

function bearerAuthOptions(): SecuritySchemeObject {
    return {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        in: "header",
    }
}