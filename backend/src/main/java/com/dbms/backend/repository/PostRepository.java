package com.dbms.backend.repository;

import com.dbms.backend.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostRepository
        extends JpaRepository<Post, Long> {

    List<Post> findByAuthorEmail(
            String authorEmail
    );

    void deleteByAuthorEmail(
            String authorEmail
    );
}
