package com.exence.finance.config.openapi;

import com.exence.finance.common.annotations.ExenceOpenApi;
import com.exence.finance.common.exception.ErrorCode;
import io.swagger.v3.core.converter.ModelConverters;
import io.swagger.v3.core.converter.ResolvedSchema;
import io.swagger.v3.oas.models.Operation;
import io.swagger.v3.oas.models.examples.Example;
import io.swagger.v3.oas.models.media.Content;
import io.swagger.v3.oas.models.media.MediaType;
import io.swagger.v3.oas.models.media.Schema;
import io.swagger.v3.oas.models.responses.ApiResponse;
import io.swagger.v3.oas.models.responses.ApiResponses;
import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springdoc.core.customizers.OperationCustomizer;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.context.MessageSource;
import org.springframework.context.NoSuchMessageException;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.mvc.method.RequestMappingInfo;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;

@Slf4j
@Component
@RequiredArgsConstructor
public class ExenceOperationCustomizer implements OperationCustomizer {

    private static final String PROBLEM_BASE_URI = "https://api.exence.com/problems/";
    private static final String EXAMPLE_TIMESTAMP = "2026-01-01T12:00:00Z";
    private static final String APPLICATION_JSON = "application/json";

    private final MessageSource messageSource;
    private final ObjectProvider<RequestMappingHandlerMapping> handlerMappingProvider;

    @Override
    public Operation customize(Operation operation, HandlerMethod handlerMethod) {
        ExenceOpenApi annotation = handlerMethod.getMethodAnnotation(ExenceOpenApi.class);
        if (annotation == null) {
            return operation;
        }

        if (!annotation.summary().isEmpty()) {
            operation.setSummary(annotation.summary());
        }
        if (!annotation.description().isEmpty()) {
            operation.setDescription(annotation.description());
        }

        String instancePath = resolveInstancePath(handlerMethod);

        ApiResponses responses;
        if (!isListResponse(handlerMethod)) {
            responses = new ApiResponses();
            responses.addApiResponse(
                    String.valueOf(annotation.successStatus()), buildSuccessResponse(annotation, handlerMethod));
        } else {
            responses = operation.getResponses();
        }
        buildErrorResponses(annotation.errors(), instancePath).forEach(responses::addApiResponse);
        operation.setResponses(responses);

        return operation;
    }

    private ApiResponse buildSuccessResponse(ExenceOpenApi annotation, HandlerMethod handlerMethod) {
        ApiResponse response = new ApiResponse().description(annotation.successDescription());

        Type bodyType = extractBodyType(handlerMethod);
        if (bodyType == null || isVoid(bodyType)) {
            return response;
        }

        try {
            ResolvedSchema resolvedSchema = ModelConverters.getInstance().readAllAsResolvedSchema(bodyType);
            if (resolvedSchema != null && resolvedSchema.schema != null) {
                response.content(
                        new Content().addMediaType(APPLICATION_JSON, new MediaType().schema(resolvedSchema.schema)));
            }
        } catch (Exception e) {
            log.warn("Could not resolve schema for type {}: {}", bodyType.getTypeName(), e.getMessage());
        }

        return response;
    }

    private Map<String, ApiResponse> buildErrorResponses(ErrorCode[] errors, String instancePath) {
        if (errors.length == 0) {
            return Map.of();
        }

        Map<Integer, List<ErrorCode>> byStatus = Arrays.stream(errors)
                .collect(Collectors.groupingBy(ec -> ec.getStatus().value()));

        Map<String, ApiResponse> result = new LinkedHashMap<>();
        byStatus.forEach((statusCode, errorCodes) ->
                result.put(String.valueOf(statusCode), buildErrorApiResponse(errorCodes, instancePath)));
        return result;
    }

    @SuppressWarnings("unchecked")
    private ApiResponse buildErrorApiResponse(List<ErrorCode> errorCodes, String instancePath) {
        String statusDescription =
                errorCodes.stream().map(ec -> getMessage(ec.getTitleKey())).collect(Collectors.joining(" / "));

        MediaType mediaType = new MediaType().schema(new Schema<>().$ref("#/components/schemas/ProblemDetail"));

        errorCodes.forEach(errorCode ->
                mediaType.addExamples(errorCode.getProblemSlug(), buildProblemDetailExample(errorCode, instancePath)));

        return new ApiResponse()
                .description(statusDescription)
                .content(new Content().addMediaType(APPLICATION_JSON, mediaType));
    }

    private Example buildProblemDetailExample(ErrorCode errorCode, String instancePath) {
        String title = getMessage(errorCode.getTitleKey());
        String detail = getMessage(errorCode.getMessageKey());

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("type", PROBLEM_BASE_URI + errorCode.getProblemSlug());
        body.put("title", title);
        body.put("status", errorCode.getStatus().value());
        body.put("detail", detail);
        body.put("instance", instancePath);
        body.put("timestamp", EXAMPLE_TIMESTAMP);

        return new Example().summary(title).value(body);
    }

    private String resolveInstancePath(HandlerMethod handlerMethod) {
        return handlerMappingProvider.stream()
                .flatMap(mapping -> mapping.getHandlerMethods().entrySet().stream())
                .filter(entry -> entry.getValue().equals(handlerMethod))
                .map(entry -> extractFirstPattern(entry.getKey()))
                .findFirst()
                .orElse("/api/...");
    }

    private String extractFirstPattern(RequestMappingInfo mappingInfo) {
        if (mappingInfo.getPatternValues() != null
                && !mappingInfo.getPatternValues().isEmpty()) {
            return mappingInfo.getPatternValues().iterator().next();
        }
        if (mappingInfo.getPathPatternsCondition() != null
                && !mappingInfo.getPathPatternsCondition().getPatterns().isEmpty()) {
            return mappingInfo
                    .getPathPatternsCondition()
                    .getPatterns()
                    .iterator()
                    .next()
                    .getPatternString();
        }
        return "/api/...";
    }

    private Type extractBodyType(HandlerMethod handlerMethod) {
        Type returnType = handlerMethod.getMethod().getGenericReturnType();
        if (!(returnType instanceof ParameterizedType pt)) {
            return null;
        }
        if (!ResponseEntity.class.equals(pt.getRawType())) {
            return null;
        }
        Type[] typeArgs = pt.getActualTypeArguments();
        return typeArgs.length > 0 ? typeArgs[0] : null;
    }

    private boolean isVoid(Type type) {
        return Void.class.equals(type) || void.class.equals(type);
    }

    private String getMessage(String key) {
        try {
            return messageSource.getMessage(key, null, Locale.ENGLISH);
        } catch (NoSuchMessageException | NoSuchElementException e) {
            return key;
        }
    }

    private boolean isListResponse(HandlerMethod handlerMethod) {
        Type returnType = handlerMethod.getMethod().getGenericReturnType();

        // ResponseEntity<List<T>>
        if (returnType instanceof ParameterizedType pt && pt.getRawType().equals(ResponseEntity.class)) {
            Type[] typeArgs = pt.getActualTypeArguments();
            if (typeArgs.length > 0 && typeArgs[0] instanceof ParameterizedType innerPt) {
                return innerPt.getRawType() == List.class;
            }
        }
        return false;
    }
}
