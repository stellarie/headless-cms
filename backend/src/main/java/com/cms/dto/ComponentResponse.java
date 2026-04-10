package com.cms.dto;

import com.cms.entity.HookType;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@Data
public class ComponentResponse {
    private UUID id;
    private String name;
    private String description;
    private String schema;
    private Map<HookType, String> hooks;
    private String rendererSource;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
