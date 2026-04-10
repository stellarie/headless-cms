package com.cms.repository;

import com.cms.entity.ContentEntry;
import com.cms.entity.EntryStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ContentEntryRepository extends JpaRepository<ContentEntry, UUID> {
    List<ContentEntry> findByComponentId(UUID componentId);
    List<ContentEntry> findByComponentIdAndStatus(UUID componentId, EntryStatus status);
}
