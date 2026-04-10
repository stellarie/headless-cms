package com.cms.service;

import com.cms.dto.ComponentRequest;
import com.cms.dto.ComponentResponse;
import com.cms.entity.Component;
import com.cms.entity.HookType;
import com.cms.repository.ComponentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class ComponentService {

    private final ComponentRepository componentRepository;
    private final GroovyExecutionService groovyExecutionService;

    public List<ComponentResponse> findAll() {
        return componentRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    public ComponentResponse findById(UUID id) {
        return componentRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new IllegalArgumentException("Component not found: " + id));
    }

    @Transactional
    public ComponentResponse create(ComponentRequest request) {
        if (componentRepository.existsByName(request.getName())) {
            throw new IllegalArgumentException("Component with name '" + request.getName() + "' already exists");
        }
        validateHookScripts(request.getHooks());

        Component component = new Component();
        component.setName(request.getName());
        component.setDescription(request.getDescription());
        component.setSchema(request.getSchema());
        component.setRendererSource(request.getRendererSource());
        if (request.getHooks() != null) {
            component.getHooks().putAll(request.getHooks());
        }

        return toResponse(componentRepository.save(component));
    }

    @Transactional
    public ComponentResponse update(UUID id, ComponentRequest request) {
        Component component = componentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Component not found: " + id));

        validateHookScripts(request.getHooks());

        component.setName(request.getName());
        component.setDescription(request.getDescription());
        component.setSchema(request.getSchema());
        component.setRendererSource(request.getRendererSource());
        component.getHooks().clear();
        if (request.getHooks() != null) {
            component.getHooks().putAll(request.getHooks());
        }

        return toResponse(componentRepository.save(component));
    }

    @Transactional
    public void delete(UUID id) {
        if (!componentRepository.existsById(id)) {
            throw new IllegalArgumentException("Component not found: " + id);
        }
        componentRepository.deleteById(id);
    }

    private void validateHookScripts(Map<HookType, String> hooks) {
        if (hooks == null) return;
        hooks.forEach((hookType, script) -> {
            String error = groovyExecutionService.validateScript(script);
            if (error != null) {
                throw new IllegalArgumentException("Invalid Groovy script for hook " + hookType + ": " + error);
            }
        });
    }

    public ComponentResponse toResponse(Component c) {
        ComponentResponse r = new ComponentResponse();
        r.setId(c.getId());
        r.setName(c.getName());
        r.setDescription(c.getDescription());
        r.setSchema(c.getSchema());
        r.setHooks(c.getHooks());
        r.setRendererSource(c.getRendererSource());
        r.setCreatedAt(c.getCreatedAt());
        r.setUpdatedAt(c.getUpdatedAt());
        return r;
    }
}
