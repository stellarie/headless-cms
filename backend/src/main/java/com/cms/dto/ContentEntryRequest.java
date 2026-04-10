package com.cms.dto;

import com.cms.entity.EntryStatus;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ContentEntryRequest {
    @NotBlank
    private String data;
    private EntryStatus status;
}
