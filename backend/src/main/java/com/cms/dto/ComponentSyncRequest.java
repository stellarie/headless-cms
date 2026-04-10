package com.cms.dto;

import lombok.Data;
import java.util.List;

@Data
public class ComponentSyncRequest {
    private List<ComponentManifestEntry> components;

    @Data
    public static class ComponentManifestEntry {
        private String name;
        private String description;
        private String schema;
        private String defaultData;
    }
}
