package com.cms.controller;

import com.cms.dto.ContentEntryRequest;
import com.cms.dto.ContentEntryResponse;
import com.cms.service.ContentEntryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/components/{componentId}/entries")
@RequiredArgsConstructor
public class ContentEntryController {

    private final ContentEntryService contentEntryService;

    @GetMapping
    public List<ContentEntryResponse> findAll(@PathVariable UUID componentId) {
        return contentEntryService.findByComponent(componentId);
    }

    @GetMapping("/{id}")
    public ContentEntryResponse findById(@PathVariable UUID componentId, @PathVariable UUID id) {
        return contentEntryService.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ContentEntryResponse create(
            @PathVariable UUID componentId,
            @Valid @RequestBody ContentEntryRequest request) {
        return contentEntryService.create(componentId, request);
    }

    @PutMapping("/{id}")
    public ContentEntryResponse update(
            @PathVariable UUID componentId,
            @PathVariable UUID id,
            @Valid @RequestBody ContentEntryRequest request) {
        return contentEntryService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID componentId, @PathVariable UUID id) {
        contentEntryService.delete(id);
    }
}
