package com.cms.controller;

import com.cms.dto.PageRequest;
import com.cms.dto.PageResponse;
import com.cms.service.PageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/pages")
@RequiredArgsConstructor
public class PageController {

    private final PageService pageService;

    @GetMapping
    public List<PageResponse> findAll() {
        return pageService.findAll();
    }

    @GetMapping("/{id}")
    public PageResponse findById(@PathVariable UUID id) {
        return pageService.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PageResponse create(@Valid @RequestBody PageRequest request) {
        return pageService.create(request);
    }

    @PutMapping("/{id}")
    public PageResponse update(@PathVariable UUID id, @Valid @RequestBody PageRequest request) {
        return pageService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) {
        pageService.delete(id);
    }
}
