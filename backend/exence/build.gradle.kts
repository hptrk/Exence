plugins {
    java
    checkstyle
    jacoco
    alias(libs.plugins.spring.boot)
    alias(libs.plugins.spring.dependency.management)
    alias(libs.plugins.spotless)
}

group = "com.exence"
version = "1.0.0"

java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(23)
    }
}

spotless {
    java {
        target("src/**/*.java")

        palantirJavaFormat(
            libs.versions.palantir.java.format
                .get(),
        ) // Google Java Format based formatter
        importOrder()
        removeUnusedImports()
        trimTrailingWhitespace()
        endWithNewline()

        // spotless:off and // spotless:on can be used to disable/enable formatting for specific code blocks
        toggleOffOn()
    }

    kotlinGradle {
        target("*.gradle.kts")
        ktlint(libs.versions.ktlint.get())
    }
}

tasks.named("check") {
    dependsOn("spotlessCheck")
}

checkstyle {
    toolVersion = libs.versions.checkstyle.get()
    // Use Google Java Style checks with custom suppressions
    configDirectory = file("config/checkstyle")
    isIgnoreFailures = false
}

tasks.withType<Checkstyle> {
    reports {
        xml.required.set(true)
        html.required.set(true)
    }
}

// Source sets

sourceSets {
    create("integrationTest") {
        java.srcDir("src/integrationTest/java")
        resources.srcDir("src/integrationTest/resources")
        compileClasspath += sourceSets.main.get().output + configurations["testRuntimeClasspath"]
        runtimeClasspath += output + compileClasspath
    }
}

val integrationTestImplementation: Configuration by configurations.getting {
    extendsFrom(configurations.testImplementation.get())
}

val integrationTestRuntimeOnly: Configuration by configurations.getting {
    extendsFrom(configurations.testRuntimeOnly.get())
}

configurations {
    compileOnly {
        extendsFrom(configurations.annotationProcessor.get())
    }
    testCompileOnly {
        extendsFrom(configurations.testAnnotationProcessor.get())
    }
    named("integrationTestCompileOnly") {
        extendsFrom(configurations.annotationProcessor.get())
    }
}

// Dependencies

dependencies {
    // Spring Boot Starters
    implementation(libs.spring.boot.starter.data.jpa)
    implementation(libs.spring.boot.starter.security)
    implementation(libs.spring.boot.starter.web)
    implementation(libs.spring.boot.starter.mail)
    implementation(libs.spring.boot.starter.validation)
    // Audit logging
    implementation(libs.javers.spring.boot.starter.sql)

    // OpenAPI / Swagger UI
    implementation(libs.springdoc.openapi.ui)

    // JWT
    implementation(libs.jjwt.api)
    runtimeOnly(libs.jjwt.impl)
    runtimeOnly(libs.jjwt.jackson)

    // Password Hashing (lightweight, ~200KB vs ~6MB BouncyCastle)
    implementation(libs.argon2.jvm)

    // Lombok
    annotationProcessor(libs.lombok)
    testAnnotationProcessor(libs.lombok)
    annotationProcessor(libs.lombok.mapstruct.binding)

    // Mapping libraries
    implementation(libs.mapstruct)
    annotationProcessor(libs.mapstruct.processor)

    // Database
    implementation(libs.liquibase.core)
    runtimeOnly(libs.postgresql)

    // QueryDSL
    implementation(libs.querydsl.jpa) {
        artifact {
            classifier = "jakarta"
        }
    }
    annotationProcessor(libs.querydsl.apt) {
        artifact {
            classifier = "jakarta"
        }
    }
    annotationProcessor("jakarta.annotation:jakarta.annotation-api")
    annotationProcessor("jakarta.persistence:jakarta.persistence-api")

    // Unit testing
    testImplementation(libs.spring.boot.starter.test)
    testImplementation(libs.spring.security.test)
    testImplementation(libs.mockito.core)

    // Integration testing
    integrationTestImplementation(libs.rest.assured)
    integrationTestImplementation(libs.spring.boot.testcontainers)
    integrationTestImplementation(libs.testcontainers.junit)
    integrationTestImplementation(libs.testcontainers.postgresql)
}

// Compilation

tasks.withType<JavaCompile> {
    options.compilerArgs.add("-Amapstruct.defaultComponentModel=spring")
    options.generatedSourceOutputDirectory.set(file("build/generated/sources/annotationProcessor/java/main"))
}

// JaCoCo excludes

val jacocoExcludes =
    listOf(
        // DTOs, entities, data holders
        "**/dto/**",
        "**/entity/**",
        "**/enums/**",
        "**/event/**",
        "**/projection/**",
        // Annotations and constants
        "**/annotations/**",
        "**/util/ApplicationConstants.class",
        "**/util/ValidationConstants.class",
        "**/util/StatisticsConstants.class",
        // Generated code
        "**/ExenceApplication.class",
        "**/*MapperImpl.class",
        "**/Q*.class",
        // Spring config (wiring tested via integration tests)
        "**/config/**",
        // Interfaces - implementation classes carry the logic
        "**/*Controller.class",
        "**/*Service.class",
        "**/*Repository.class",
        "**/*Mapper.class",
        // Simple exception types (GlobalExceptionHandler is intentionally kept)
        "**/exception/ErrorCode.class",
        "**/exception/ExenceException.class",
        // Side-effectful infrastructure (better covered by integration tests)
        "**/scheduler/**",
        "**/listener/**",
        // boilerplate
        "**/context/**",
        "**/client/FrankfurterRateResponse.class",
        "**/package-info.class",
    )

// Test tasks

tasks.withType<Test> {
    useJUnitPlatform()
}

tasks.test {
    finalizedBy(tasks.named("jacocoTestReport"))
}

// JaCoCo reports — must be registered before integrationTest references them

tasks.named<JacocoReport>("jacocoTestReport") {
    dependsOn(tasks.test)
    reports {
        xml.required.set(true)
        html.required.set(true)
    }
    classDirectories.setFrom(
        sourceSets.main.get().output.asFileTree.matching {
            exclude(jacocoExcludes)
        },
    )
}

val jacocoIntegrationTestReport =
    tasks.register<JacocoReport>("jacocoIntegrationTestReport") {
        executionData.setFrom(
            fileTree(layout.buildDirectory).include("jacoco/integrationTest.exec"),
        )
        classDirectories.setFrom(
            sourceSets.main.get().output.asFileTree.matching {
                exclude(jacocoExcludes)
            },
        )
        reports {
            xml.required.set(true)
            html.required.set(true)
        }
    }

tasks.register<Test>("integrationTest") {
    description = "Runs integration tests against a real PostgreSQL container"
    group = "verification"
    testClassesDirs = sourceSets["integrationTest"].output.classesDirs
    classpath = sourceSets["integrationTest"].runtimeClasspath
    useJUnitPlatform()
    finalizedBy(jacocoIntegrationTestReport)
    shouldRunAfter(tasks.test)
}

tasks.named<JacocoCoverageVerification>("jacocoTestCoverageVerification") {
    dependsOn(tasks.named("jacocoTestReport"))
    violationRules {
        rule {
            limit {
                counter = "LINE"
                value = "COVEREDRATIO"
                minimum = "0.70".toBigDecimal()
            }
        }
        rule {
            includes =
                listOf(
                    "com.exence.finance.modules.auth.service.impl.*",
                    "com.exence.finance.security.*",
                )
            limit {
                counter = "LINE"
                value = "COVEREDRATIO"
                minimum = "0.80".toBigDecimal()
            }
        }
    }
}

tasks.check {
    dependsOn(tasks.named("jacocoTestCoverageVerification"))
}
