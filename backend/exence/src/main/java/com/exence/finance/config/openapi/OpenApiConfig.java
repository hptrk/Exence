package com.exence.finance.config.openapi;

import io.swagger.v3.core.converter.ModelConverters;
import io.swagger.v3.core.converter.ResolvedSchema;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.media.DateTimeSchema;
import io.swagger.v3.oas.models.media.Schema;
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
        };
    }
}
