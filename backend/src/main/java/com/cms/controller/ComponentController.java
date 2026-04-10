package com.cms.controller;

import com.cms.dto.ComponentRequest;
import com.cms.dto.ComponentResponse;
import com.cms.dto.ComponentSyncRequest;
import com.cms.dto.ScriptExecutionRequest;
import com.cms.entity.Component;
import com.cms.repository.ComponentRepository;
import com.cms.service.ComponentService;
import com.cms.service.ContentEntryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/components")
@RequiredArgsConstructor
public class ComponentController {

    private final ComponentService componentService;
    private final ContentEntryService contentEntryService;
    private final ComponentRepository componentRepository;

    @GetMapping
    public List<ComponentResponse> findAll() {
        return componentService.findAll();
    }

    @GetMapping("/{id}")
    public ComponentResponse findById(@PathVariable UUID id) {
        return componentService.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ComponentResponse create(@Valid @RequestBody ComponentRequest request) {
        return componentService.create(request);
    }

    @PutMapping("/{id}")
    public ComponentResponse update(@PathVariable UUID id, @Valid @RequestBody ComponentRequest request) {
        return componentService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) {
        componentService.delete(id);
    }

    /**
     * Called by the frontend on startup with the list of components discovered via import.meta.glob.
     * Seeds any new components that don't exist yet — preserves existing ones untouched.
     */
    @PostMapping("/sync")
    @Transactional
    public ResponseEntity<Void> sync(@RequestBody ComponentSyncRequest request) {
        if (request.getComponents() == null) return ResponseEntity.ok().build();
        for (ComponentSyncRequest.ComponentManifestEntry entry : request.getComponents()) {
            if (!componentRepository.existsByName(entry.getName())) {
                Component c = new Component();
                c.setName(entry.getName());
                c.setDescription(entry.getDescription());
                c.setSchema(entry.getSchema());
                componentRepository.save(c);
            }
        }
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/execute")
    public ResponseEntity<Map<String, Object>> executeOnRequest(
            @PathVariable UUID id,
            @RequestBody(required = false) ScriptExecutionRequest request) {
        Map<String, Object> result = contentEntryService.executeOnRequest(
                id, request != null ? request.getContext() : null);
        return ResponseEntity.ok(result);
    }
}
