package com.dbms.backend.repository;

import com.dbms.backend.entity.Draft;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DraftRepository
        extends JpaRepository<Draft, Long> {

    List<Draft> findByAuthorEmail(
            String authorEmail
    );
}