package com.cms.service;

import com.cms.dto.PageRequest;
import com.cms.dto.PageResponse;
import com.cms.entity.Page;
import com.cms.repository.PageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PageService {

    private final PageRepository pageRepository;

    public List<PageResponse> findAll() {
        return pageRepository.findAll().stream().map(this::toResponse).toList();
    }

    public PageResponse findById(UUID id) {
        return pageRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new IllegalArgumentException("Page not found: " + id));
    }

    @Transactional
    public PageResponse create(PageRequest request) {
        if (pageRepository.existsBySlug(request.getSlug())) {
            throw new IllegalArgumentException("Slug '" + request.getSlug() + "' is already taken");
        }
        Page page = new Page();
        page.setName(request.getName());
        page.setSlug(request.getSlug());
        page.setBlocks(request.getBlocks() != null ? request.getBlocks() : "[]");
        return toResponse(pageRepository.save(page));
    }

    @Transactional
    public PageResponse update(UUID id, PageRequest request) {
        Page page = pageRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Page not found: " + id));
        page.setName(request.getName());
        page.setSlug(request.getSlug());
        page.setBlocks(request.getBlocks() != null ? request.getBlocks() : "[]");
        return toResponse(pageRepository.save(page));
    }

    @Transactional
    public void delete(UUID id) {
        if (!pageRepository.existsById(id)) {
            throw new IllegalArgumentException("Page not found: " + id);
        }
        pageRepository.deleteById(id);
    }

    private PageResponse toResponse(Page p) {
        PageResponse r = new PageResponse();
        r.setId(p.getId());
        r.setName(p.getName());
        r.setSlug(p.getSlug());
        r.setBlocks(p.getBlocks());
        r.setCreatedAt(p.getCreatedAt());
        r.setUpdatedAt(p.getUpdatedAt());
        return r;
    }
}
