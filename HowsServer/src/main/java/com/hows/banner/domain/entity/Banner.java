package com.hows.banner.domain.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;

@Entity
public class Banner {
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "BANNER_SEQ_GENERRATOR")
	@SequenceGenerator(name="BANNER_SEQ_GENERATOR", sequenceName="BANNER_SEQ", initialValue = 1, allocationSize = 1)
	private Long seq;
	
}
