package com.cms.dto;

import lombok.Data;

import java.util.Map;

@Data
public class ScriptExecutionRequest {
    private Map<String, Object> context;
}
