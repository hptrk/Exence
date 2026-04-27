package com.exence.finance.config.openapi;

import io.swagger.v3.core.converter.ModelConverters;
import io.swagger.v3.core.converter.ResolvedSchema;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.media.DateTimeSchema;
import io.swagger.v3.oas.models.media.Schema;
import io.swagger.v3.oas.models.media.StringSchema;
import io.swagger.v3.oas.models.parameters.Parameter;
import org.springdoc.core.customizers.OpenApiCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.ProblemDetail;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenApiCustomizer problemDetailSchemaCustomizer() {
        return (OpenAPI openApi) -> {
            ResolvedSchema resolved = ModelConverters.getInstance().readAllAsResolvedSchema(ProblemDetail.class);
            if (resolved == null) {
                return;
            }
            if (openApi.getComponents() == null) {
                openApi.setComponents(new io.swagger.v3.oas.models.Components());
            }
            if (resolved.referencedSchemas != null) {
                resolved.referencedSchemas.forEach(
                        (name, schema) -> openApi.getComponents().addSchemas(name, schema));
            }
            Schema<?> rootSchema = resolved.schema;
            if (rootSchema != null) {
                rootSchema.addProperty("timestamp", new DateTimeSchema().description("Time when the error occurred"));
                String schemaName = rootSchema.getName() != null ? rootSchema.getName() : "ProblemDetail";
                openApi.getComponents().addSchemas(schemaName, rootSchema);
            }

            openApi.getPaths().forEach((path, pathItem) -> {
                pathItem.readOperations().forEach(operation -> {
                    operation.addParametersItem(new Parameter().$ref("#/components/parameters/Accept-Language"));
                });

                // TODO: get these URLs from config (refactor interceptor too)
                if (!path.startsWith("/api/auth")
                        && !path.startsWith("/api/admin")
                        && !path.startsWith("/api/exchange-rates")
                        && !path.startsWith("/api/user")
                        && !path.startsWith("/api/sessions")) {

                    pathItem.readOperations().forEach(operation -> {
                        operation.addParametersItem(new Parameter().$ref("#/components/parameters/WorkspaceHeader"));
                    });
                }
            });
        };
    }

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .components(new Components()
                        .addParameters(
                                "WorkspaceHeader",
                                new Parameter()
                                        .in("header")
                                        .name("X-Workspace-ID")
                                        .description("ID of the workspace to operate in")
                                        .example("1")
                                        .required(true)
                                        .schema(new StringSchema()))
                        .addParameters(
                                "Accept-Language",
                                new Parameter()
                                        .in("header")
                                        .name("Accept-Language")
                                        .description("Preferred language for responses "
                                                + "('en', 'hu', 'de', 'fr', 'it', 'es', 'pl', 'sk')")
                                        .example("en")
                                        .required(false)
                                        .schema(new StringSchema())))
                .info(new Info().title("Exence API").version("1.0"));
    }
}
