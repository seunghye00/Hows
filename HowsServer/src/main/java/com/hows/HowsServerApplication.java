package com.hows;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class HowsServerApplication {

	public static void main(String[] args) {
		SpringApplication.run(HowsServerApplication.class, args);
	}

}
