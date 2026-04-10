package com.cms.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PageRequest {
    @NotBlank
    private String name;

    @NotBlank
    private String slug;

    private String blocks = "[]";
}
