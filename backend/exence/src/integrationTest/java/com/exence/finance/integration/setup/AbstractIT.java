package com.exence.finance.integration.setup;

import com.exence.finance.modules.email.service.EmailService;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.restassured.RestAssured;
import io.restassured.config.ObjectMapperConfig;
import io.restassured.config.RestAssuredConfig;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

// Static container is shared across all test classes, starts once per JVM run.
// Spring context is also shared, actors build per-test RequestSpecifications using
// the injected port, so no global RestAssured.port is ever set.
@Testcontainers
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
public abstract class AbstractIT {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine")
            .withDatabaseName("exence_test")
            .withUsername("exencedev")
            .withPassword("exencepwd");

    @DynamicPropertySource
    static void datasourceProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
    }

    // mocked globally so the Spring context is shared between all IT subclasses
    // email sending is a side effect that must not run during tests
    @MockitoBean
    protected EmailService emailService;

    @LocalServerPort
    protected int port;

    @Autowired
    protected ObjectMapper objectMapper;

    @Autowired
    protected JdbcTemplate jdbcTemplate;

    @BeforeEach
    void baseSetUp() {
        // don't set RestAssured.port here, because that is global static state which is unsafe for
        // parallel class execution. Each actor builds its own RequestSpecification with an explicit
        // base URI that includes the port.
        //
        // Setting RestAssured.config is idempotent (same ObjectMapper value for every class)
        // so it is safe to call from multiple threads simultaneously.
        RestAssured.config = restAssuredConfig();
    }

    protected RestAssuredConfig restAssuredConfig() {
        return RestAssuredConfig.config()
                .objectMapperConfig(ObjectMapperConfig.objectMapperConfig()
                        .jackson2ObjectMapperFactory((cls, charset) -> objectMapper));
    }
}
