package com.cms.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class PageResponse {
    private UUID id;
    private String name;
    private String slug;
    private String blocks;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
