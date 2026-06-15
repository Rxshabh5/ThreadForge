package com.dbms.backend.controller;

import com.dbms.backend.entity.Post;

import com.dbms.backend.repository.UserRepository;

import com.dbms.backend.security.JwtUtil;

import com.dbms.backend.service.PostService;
import com.dbms.backend.service.MongoSyncService;

import com.dbms.backend.user.User;

import io.jsonwebtoken.Claims;

import org.springframework.web.client.RestTemplate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;

import org.springframework.transaction.annotation.Transactional;

import org.springframework.web.bind.annotation.*;

import java.util.HashMap;

import java.util.List;

import java.util.Map;

import java.util.stream.Collectors;

@RestController

@RequestMapping("/admin")

@CrossOrigin("*")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PostService postService;

    @Autowired
    private MongoSyncService mongoSyncService;

        @Autowired
        private com.dbms.backend.repository.DraftRepository draftRepository;

    @Autowired
    private JwtUtil jwtUtil;

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${node.backend.url:http://localhost:5000}")
    private String nodeBackendUrl;


    private User requireAdmin(
            String authHeader
    ) {

        String token =
                authHeader.substring(7);

        Claims claims =
                jwtUtil.validateToken(token);

        User user =
                userRepository
                        .findByEmail(claims.getSubject())
                        .orElseThrow();

        if (!"ADMIN".equals(user.getRole())) {

            throw new RuntimeException("Admin access required");
        }

        return user;
    }


    @GetMapping("/users")
    public List<Map<String, Object>> getUsers(

            @RequestHeader("Authorization")
            String authHeader
    ) {

        requireAdmin(authHeader);

        return userRepository
                .findAll()
                .stream()
                .map(user -> {

                    List<Post> posts =
                            postService.getPostsByAuthor(
                                    user.getEmail()
                            );

                    Map<String, Object> item =
                            new HashMap<>();

                    item.put("id", user.getId());
                    item.put("username", user.getUsername());
                    item.put("email", user.getEmail());
                    item.put("role", user.getRole());
                    item.put("postCount", posts.size());
                    item.put("posts", posts);

                    return item;
                })
                .collect(Collectors.toList());
    }


        @GetMapping("/posts")
        public List<Post> getAllPosts(

                        @RequestHeader("Authorization")
                        String authHeader
        ) {

                requireAdmin(authHeader);

                return postService.getAllPosts();
        }


        @GetMapping("/stats")
        public Map<String, Object> getStats(

                        @RequestHeader("Authorization")
                        String authHeader
        ) {

                requireAdmin(authHeader);

                Map<String, Object> stats = new HashMap<>();

                long totalUsers = userRepository.count();
                long totalPosts = postService.getAllPosts().size();
                // drafts stored in drafts table
                long totalDrafts = draftRepository.count();

                stats.put("totalUsers", totalUsers);
                stats.put("totalPosts", totalPosts);
                stats.put("totalDrafts", totalDrafts);

                return stats;
        }


    @DeleteMapping("/users/{id}")
    @Transactional
    public Map<String, String> deleteUser(

            @PathVariable
            Long id,

            @RequestHeader("Authorization")
            String authHeader
    ) {

        User currentUser =
                requireAdmin(authHeader);

        User targetUser =
                userRepository
                        .findById(id)
                        .orElseThrow();

        if (currentUser.getId().equals(targetUser.getId())) {

            throw new RuntimeException("Admins cannot delete their own account");
        }

        postService.deletePostsByAuthor(
                targetUser.getEmail()
        );

        userRepository.deleteById(id);
        mongoSyncService.deleteUser(id);

        Map<String, String> response =
                new HashMap<>();

        response.put("message", "User deleted");

        return response;
    }

    @PutMapping("/users/{id}/role")
    @Transactional
    public Map<String, String> updateUserRole(
            @PathVariable
            Long id,
            @RequestBody Map<String, String> body,
            @RequestHeader("Authorization")
            String authHeader
    ) {

        User currentUser =
                requireAdmin(authHeader);

        User targetUser =
                userRepository
                        .findById(id)
                        .orElseThrow();

        String newRole = body.get("role");
        if (newRole == null || newRole.isBlank()) {
            throw new RuntimeException("Role is required");
        }

        if (currentUser.getId().equals(targetUser.getId()) && !currentUser.getRole().equals(newRole)) {
            throw new RuntimeException("Admins cannot change their own role");
        }

        targetUser.setRole(newRole);
        userRepository.save(targetUser);
        mongoSyncService.updateUserRole(id, newRole);

        try {
            Map<String, Object> log = new HashMap<>();
            log.put("user", currentUser.getEmail());
            log.put("action", "role-change");
            log.put("entityType", "user");
            log.put("entityId", id);
            restTemplate.postForObject(nodeBackendUrl + "/logs", log, String.class);
        } catch (Exception e) {
            System.out.println("Role change audit log failed: " + e.getMessage());
        }

        Map<String, String> response =
                new HashMap<>();
        response.put("message", "User role updated");
        response.put("role", newRole);

        return response;
    }
}
