package com.exence.finance;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class ExenceApplication {

	public static void main(String[] args) {
		SpringApplication.run(ExenceApplication.class, args);
	}

}
