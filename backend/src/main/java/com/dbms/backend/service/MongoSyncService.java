package com.dbms.backend.service;

import com.dbms.backend.entity.Comment;
import com.dbms.backend.user.User;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class MongoSyncService {

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${node.backend.url:http://localhost:5000}")
    private String nodeBackend;

    public void syncUser(User user) {
        try {
            Map<String, Object> payload = new HashMap<>();
            payload.put("postgresId", user.getId());
            payload.put("username", user.getUsername());
            payload.put("email", user.getEmail());
            payload.put("password", user.getPassword());
            payload.put("role", user.getRole());

            restTemplate.postForObject(nodeBackend + "/users", payload, String.class);
        } catch (Exception e) {
            System.out.println("MongoDB user sync failed: " + e.getMessage());
        }
    }

    public void updateUserRole(Long userId, String role) {
        try {
            Map<String, Object> payload = new HashMap<>();
            payload.put("role", role);

            restTemplate.put(nodeBackend + "/users/" + userId + "/role", payload);
        } catch (Exception e) {
            System.out.println("MongoDB user role sync failed: " + e.getMessage());
        }
    }

    public void deleteUser(Long userId) {
        try {
            restTemplate.delete(nodeBackend + "/users/" + userId);
        } catch (Exception e) {
            System.out.println("MongoDB user cleanup failed: " + e.getMessage());
        }
    }

    public void syncComment(Comment comment) {
        try {
            Map<String, Object> payload = new HashMap<>();
            payload.put("postgresId", comment.getId());
            payload.put("postId", comment.getPostId());
            payload.put("authorEmail", comment.getAuthorEmail());
            payload.put("authorName", comment.getAuthorName());
            payload.put("authorHandle", comment.getAuthorHandle());
            payload.put("body", comment.getBody());
            payload.put("likes", comment.getLikes());
            payload.put("createdAt", comment.getCreatedAt());

            restTemplate.postForObject(nodeBackend + "/comments", payload, String.class);
        } catch (Exception e) {
            System.out.println("MongoDB comment sync failed: " + e.getMessage());
        }
    }

    public void updateCommentLikes(Comment comment) {
        try {
            Map<String, Object> payload = new HashMap<>();
            payload.put("postgresId", comment.getId());
            payload.put("likes", comment.getLikes());

            restTemplate.postForObject(
                    nodeBackend + "/comments",
                    payload,
                    String.class
            );
        } catch (Exception e) {
            System.out.println("MongoDB comment like sync failed: " + e.getMessage());
        }
    }

    public void deleteCommentsByPost(Long postId) {
        try {
            restTemplate.delete(nodeBackend + "/comments/post/" + postId);
        } catch (Exception e) {
            System.out.println("MongoDB comment cleanup failed: " + e.getMessage());
        }
    }
}
