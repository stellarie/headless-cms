package com.cms.service;

import com.cms.dto.ContentEntryRequest;
import com.cms.dto.ContentEntryResponse;
import com.cms.entity.Component;
import com.cms.entity.ContentEntry;
import com.cms.entity.EntryStatus;
import com.cms.entity.HookType;
import com.cms.repository.ComponentRepository;
import com.cms.repository.ContentEntryRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class ContentEntryService {

    private final ContentEntryRepository contentEntryRepository;
    private final ComponentRepository componentRepository;
    private final GroovyExecutionService groovyExecutionService;
    private final ObjectMapper objectMapper;

    public List<ContentEntryResponse> findByComponent(UUID componentId) {
        return contentEntryRepository.findByComponentId(componentId).stream()
                .map(entry -> toResponse(entry, HookType.AFTER_FETCH))
                .toList();
    }

    public ContentEntryResponse findById(UUID id) {
        ContentEntry entry = contentEntryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Entry not found: " + id));
        return toResponse(entry, HookType.AFTER_FETCH);
    }

    @Transactional
    public ContentEntryResponse create(UUID componentId, ContentEntryRequest request) {
        Component component = componentRepository.findById(componentId)
                .orElseThrow(() -> new IllegalArgumentException("Component not found: " + componentId));

        String data = runHook(component, HookType.BEFORE_SAVE, request.getData(), request.getData());

        ContentEntry entry = new ContentEntry();
        entry.setComponent(component);
        entry.setData(data);
        entry.setStatus(request.getStatus() != null ? request.getStatus() : EntryStatus.DRAFT);

        ContentEntry saved = contentEntryRepository.save(entry);
        runHookFireAndForget(component, HookType.AFTER_SAVE, saved.getData());

        return toResponse(saved, null);
    }

    @Transactional
    public ContentEntryResponse update(UUID id, ContentEntryRequest request) {
        ContentEntry entry = contentEntryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Entry not found: " + id));

        String data = runHook(entry.getComponent(), HookType.BEFORE_SAVE, request.getData(), request.getData());

        entry.setData(data);
        if (request.getStatus() != null) {
            entry.setStatus(request.getStatus());
        }

        ContentEntry saved = contentEntryRepository.save(entry);
        runHookFireAndForget(entry.getComponent(), HookType.AFTER_SAVE, saved.getData());

        return toResponse(saved, null);
    }

    @Transactional
    public void delete(UUID id) {
        if (!contentEntryRepository.existsById(id)) {
            throw new IllegalArgumentException("Entry not found: " + id);
        }
        contentEntryRepository.deleteById(id);
    }

    public Map<String, Object> executeOnRequest(UUID componentId, Map<String, Object> context) {
        Component component = componentRepository.findById(componentId)
                .orElseThrow(() -> new IllegalArgumentException("Component not found: " + componentId));

        String script = component.getHooks().get(HookType.ON_REQUEST);
        if (script == null || script.isBlank()) {
            return Map.of("message", "No ON_REQUEST hook defined for this component");
        }

        return groovyExecutionService.execute(script, context != null ? context : new HashMap<>());
    }

    // --- private helpers ---

    /**
     * Runs a hook and returns the (potentially modified) data string.
     * If the script sets result.data, that replaces the original data.
     * Falls back to originalData on any issue.
     */
    private String runHook(Component component, HookType hookType, String data, String fallback) {
        String script = component.getHooks().get(hookType);
        if (script == null || script.isBlank()) return data;

        Map<String, Object> context = buildContext(component, data);
        Map<String, Object> result = groovyExecutionService.execute(script, context);

        if (Boolean.TRUE.equals(result.get("scriptFailed"))) {
            log.warn("Hook {} failed for component {}, using original data", hookType, component.getName());
            return fallback;
        }

        if (result.containsKey("data")) {
            try {
                Object resultData = result.get("data");
                if (resultData instanceof String s) return s;
                return objectMapper.writeValueAsString(resultData);
            } catch (Exception e) {
                log.warn("Could not serialize hook result data", e);
            }
        }

        return data;
    }

    private void runHookFireAndForget(Component component, HookType hookType, String data) {
        String script = component.getHooks().get(hookType);
        if (script == null || script.isBlank()) return;
        Map<String, Object> context = buildContext(component, data);
        groovyExecutionService.execute(script, context);
    }

    private Map<String, Object> buildContext(Component component, String dataJson) {
        Map<String, Object> context = new HashMap<>();
        context.put("componentId", component.getId().toString());
        context.put("componentName", component.getName());
        try {
            context.put("data", objectMapper.readValue(dataJson, new TypeReference<Map<String, Object>>() {}));
        } catch (Exception e) {
            context.put("data", dataJson);
        }
        return context;
    }

    private ContentEntryResponse toResponse(ContentEntry entry, HookType hook) {
        String data = entry.getData();

        if (hook != null) {
            String script = entry.getComponent().getHooks().get(hook);
            if (script != null && !script.isBlank()) {
                Map<String, Object> context = buildContext(entry.getComponent(), data);
                Map<String, Object> result = groovyExecutionService.execute(script, context);
                if (result.containsKey("data") && !Boolean.TRUE.equals(result.get("scriptFailed"))) {
                    try {
                        Object resultData = result.get("data");
                        data = resultData instanceof String s ? s : objectMapper.writeValueAsString(resultData);
                    } catch (Exception ignored) {}
                }
            }
        }

        ContentEntryResponse r = new ContentEntryResponse();
        r.setId(entry.getId());
        r.setComponentId(entry.getComponent().getId());
        r.setComponentName(entry.getComponent().getName());
        r.setStatus(entry.getStatus());
        r.setCreatedAt(entry.getCreatedAt());
        r.setUpdatedAt(entry.getUpdatedAt());

        try {
            r.setData(objectMapper.readValue(data, new TypeReference<>() {}));
        } catch (Exception e) {
            r.setData(Map.of("raw", data));
        }

        return r;
    }
}
