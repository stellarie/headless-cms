package com.cms.repository;

import com.cms.entity.Component;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ComponentRepository extends JpaRepository<Component, UUID> {
    Optional<Component> findByName(String name);
    boolean existsByName(String name);
}
