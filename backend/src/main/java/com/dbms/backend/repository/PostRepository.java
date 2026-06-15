package com.dbms.backend.repository;

import com.dbms.backend.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostRepository
        extends JpaRepository<Post, Long> {

    List<Post> findByAuthorEmail(
            String authorEmail
    );

    List<Post> findByStatus(String status);

    List<Post> findByStatusOrStatusIsNull(String status);

    void deleteByAuthorEmail(
            String authorEmail
    );
}
