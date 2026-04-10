package com.cms.dto;

import com.cms.entity.EntryStatus;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@Data
public class ContentEntryResponse {
    private UUID id;
    private UUID componentId;
    private String componentName;
    private Map<String, Object> data;
    private EntryStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
