plugins {
    java
    alias(libs.plugins.spring.boot)
    alias(libs.plugins.spring.dependency.management)
}

group = "com.exence"
version = "1.0.0"

java {
    sourceCompatibility = JavaVersion.VERSION_17
    targetCompatibility = JavaVersion.VERSION_17
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

    // Spring Security
    implementation(libs.spring.security.config)
    implementation(libs.spring.security.web)
    implementation(libs.spring.security.jwt)

    // JWT
    implementation(libs.jjwt.api)
    runtimeOnly(libs.jjwt.impl)
    runtimeOnly(libs.jjwt.jackson)

    // Validation
    implementation(libs.hibernate.validator)

    // Lombok
    annotationProcessor(libs.lombok)
    testAnnotationProcessor(libs.lombok)
    annotationProcessor(libs.lombok.mapstruct.binding)

    // Mapping libraries
    implementation(libs.modelmapper)
    implementation(libs.mapstruct)
    annotationProcessor(libs.mapstruct.processor)

    // Utilities
    implementation(libs.emoji.java)

    // Database
    runtimeOnly(libs.postgresql)

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
