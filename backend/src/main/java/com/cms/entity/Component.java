package com.cms.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Entity
@Table(name = "components")
@Data
public class Component {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    /**
     * JSON schema describing the fields this component's content entries will have.
     * Example: {"title": "string", "body": "text", "published": "boolean"}
     */
    @Column(columnDefinition = "TEXT")
    private String schema;

    /**
     * Map of HookType -> Groovy script source code.
     * Scripts receive: Map<String,Object> context, Map<String,Object> result
     */
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
        name = "component_hooks",
        joinColumns = @JoinColumn(name = "component_id")
    )
    @MapKeyEnumerated(EnumType.STRING)
    @MapKeyColumn(name = "hook_type")
    @Column(name = "script", columnDefinition = "TEXT")
    private Map<HookType, String> hooks = new HashMap<>();

    /**
     * JSX source code for the live renderer (optional).
     * When set, the admin UI compiles and renders this instead of the codebase renderer.
     */
    @Column(columnDefinition = "TEXT")
    private String rendererSource;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @Column(nullable = true)
    private LocalDateTime deletedAt;
}
