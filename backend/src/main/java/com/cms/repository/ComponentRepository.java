package com.cms.repository;

import com.cms.entity.Component;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ComponentRepository extends JpaRepository<Component, UUID> {
    @Query("SELECT c FROM Component c WHERE c.deletedAt IS NULL")
    List<Component> findAll();

    @Query("SELECT c FROM Component c WHERE c.id = ?1 AND c.deletedAt IS NULL")
    Optional<Component> findById(UUID id);

    @Query("SELECT c FROM Component c WHERE c.name = ?1 AND c.deletedAt IS NULL")
    Optional<Component> findByName(String name);

    @Query("SELECT CASE WHEN COUNT(c) > 0 THEN true ELSE false END FROM Component c WHERE c.name = ?1 AND c.deletedAt IS NULL")
    boolean existsByName(String name);

    @Query("SELECT c FROM Component c WHERE c.deletedAt IS NOT NULL ORDER BY c.deletedAt DESC")
    List<Component> findAllDeleted();
}
