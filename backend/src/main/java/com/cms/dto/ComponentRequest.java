package com.cms.dto;

import com.cms.entity.HookType;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.Map;

@Data
public class ComponentRequest {
    @NotBlank
    private String name;
    private String description;
    private String schema;
    private Map<HookType, String> hooks;
    private String rendererSource;
}
