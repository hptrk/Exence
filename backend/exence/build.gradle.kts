plugins {
    java
    checkstyle
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

configurations {
    compileOnly {
        extendsFrom(configurations.annotationProcessor.get())
    }
    testCompileOnly {
        extendsFrom(configurations.testAnnotationProcessor.get())
    }
}

dependencies {
    // Spring Boot Starters
    implementation(libs.spring.boot.starter.data.jpa)
    implementation(libs.spring.boot.starter.security)
    implementation(libs.spring.boot.starter.web)
    implementation(libs.spring.boot.starter.mail)
    implementation(libs.spring.boot.starter.validation)

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

    // Utilities
    implementation(libs.emoji.java)

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

    // Development tools
    developmentOnly(libs.spring.boot.devtools)

    // Testing
    testImplementation(libs.spring.boot.starter.test)
    testImplementation(libs.spring.security.test)
    testImplementation(libs.mockito.core)
}

tasks.withType<JavaCompile> {
    options.compilerArgs.add("-Amapstruct.defaultComponentModel=spring")
}

tasks.withType<Test> {
    useJUnitPlatform()
}
