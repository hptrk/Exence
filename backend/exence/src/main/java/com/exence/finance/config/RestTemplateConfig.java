package com.exence.finance.config;

import com.exence.finance.common.exception.ErrorCode;
import com.exence.finance.common.exception.ExenceException;
import com.exence.finance.config.properties.ExternalApiProperties;
import java.io.IOException;
import java.time.Duration;
import lombok.NonNull;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.web.client.ResponseErrorHandler;
import org.springframework.web.client.RestTemplate;

@Slf4j
@Configuration
public class RestTemplateConfig {

    @Bean
    public RestTemplate frankfurterRestTemplate(RestTemplateBuilder builder, ExternalApiProperties properties) {
        ExternalApiProperties.Frankfurter config = properties.frankfurter();
        Duration timeout = Duration.ofMillis(config.timeout());

        return builder.rootUri(config.baseUrl())
                .connectTimeout(timeout)
                .readTimeout(timeout)
                .errorHandler(new ResponseErrorHandler() {
                    @Override
                    public boolean hasError(@NonNull ClientHttpResponse response) throws IOException {
                        return response.getStatusCode().isError();
                    }

                    @Override
                    public void handleError(@NonNull ClientHttpResponse response) throws IOException {
                        log.error(
                                "Failed to fetch exchange rates from Frankfurter API. Status code: {}",
                                response.getStatusCode());

                        throw new ExenceException(ErrorCode.EXCHANGE_RATE_FETCH_FAILED);
                    }
                })
                .build();
    }
}
