package com.dbms.backend.service;

import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

import com.dbms.backend.entity.Post;

import com.dbms.backend.repository.PostRepository;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.HashMap;


@Service
public class PostService {

        private final RestTemplate restTemplate =
        new RestTemplate();

        private final String NODE_BACKEND = "http://localhost:5000";


    @Autowired
    private PostRepository postRepository;


    // GET ALL POSTS
    public List<Post> getAllPosts() {

        return postRepository.findAll();
    }

    public List<Post> getPostsByAuthor(
            String authorEmail
    ) {

        return postRepository.findByAuthorEmail(authorEmail);
    }


    // CREATE POST
public Post createPost(
        Post post
) {

    Post savedPost =
            postRepository.save(post);

    try {

        HttpHeaders headers =
                new HttpHeaders();

        headers.setContentType(
                MediaType.APPLICATION_JSON
        );

        HttpEntity<Post> request =
                new HttpEntity<>(
                        savedPost,
                        headers
                );

        restTemplate.postForObject(
                "http://localhost:5000/posts",
                request,
                String.class
        );

                // create a simple embedding document for discovery
                try {
                        Map<String, Object> embed = new HashMap<>();
                        embed.put("postId", savedPost.getId());
                        embed.put("title", savedPost.getTitle());
                        embed.put("category", savedPost.getCategory());
                        // derive simple keywords from title
                        String[] parts = savedPost.getTitle() != null ? savedPost.getTitle().split("\\s+") : new String[]{};
                        embed.put("keywords", parts.length > 0 ? java.util.Arrays.stream(parts).limit(10).map(s -> s.replaceAll("[^a-zA-Z]", "")).toArray(String[]::new) : new String[]{});

                        restTemplate.postForObject(NODE_BACKEND + "/embeddings", embed, String.class);
                } catch (Exception e) {
                        System.out.println("Embedding push failed: " + e.getMessage());
                }
                // create an edit log for creation
                try {
                        Map<String, Object> log = new HashMap<>();
                        log.put("user", savedPost.getAuthorEmail());
                        log.put("action", "create");
                        log.put("entityType", "post");
                        log.put("entityId", savedPost.getId());

                        restTemplate.postForObject(NODE_BACKEND + "/logs", log, String.class);
                } catch (Exception e) {
                        System.out.println("Log push failed: " + e.getMessage());
                }

    } catch (Exception e) {

        System.out.println(
                "MongoDB Sync Failed: "
                        + e.getMessage()
        );
    }

    return savedPost;
}


    // UPDATE POST
    public Post updatePost(

            Long id,

            Post updatedPost,

            String currentUserEmail,

            String currentUserRole
    ) {

        Post existingPost =
                postRepository
                        .findById(id)
                        .orElseThrow();

        boolean isOwner =
                existingPost
                        .getAuthorEmail()
                        .equals(currentUserEmail);

        boolean isAdmin =
                currentUserRole.equals("ADMIN");

        if (!isOwner && !isAdmin) {

            throw new RuntimeException(
                    "Unauthorized"
            );
        }

                // Save previous version to Node backend
                try {
                        Map<String, Object> version = new HashMap<>();
                        version.put("postId", existingPost.getId());
                        version.put("title", existingPost.getTitle());
                        version.put("content", existingPost.getContent());
                        version.put("category", existingPost.getCategory());
                        version.put("authorEmail", existingPost.getAuthorEmail());
                        version.put("versionNumber", System.currentTimeMillis());

                        restTemplate.postForObject(NODE_BACKEND + "/versions", version, String.class);

                        Map<String, Object> log = new HashMap<>();
                        log.put("user", existingPost.getAuthorEmail());
                        log.put("action", "edit");
                        log.put("entityType", "post");
                        log.put("entityId", existingPost.getId());

                        restTemplate.postForObject(NODE_BACKEND + "/logs", log, String.class);

                } catch (Exception e) {
                        System.out.println("Version/log push failed: " + e.getMessage());
                }

        existingPost.setTitle(
                updatedPost.getTitle()
        );

        existingPost.setContent(
                updatedPost.getContent()
        );

        existingPost.setCategory(
                updatedPost.getCategory()
        );

        return postRepository.save(
                existingPost
        );
    }

    public Post updatePostLikes(Long id, boolean liked) {
        Post existingPost = postRepository.findById(id).orElseThrow();
        Integer currentLikes = existingPost.getLikes() == null ? 0 : existingPost.getLikes();
        int updatedLikes = liked ? currentLikes + 1 : Math.max(0, currentLikes - 1);
        existingPost.setLikes(updatedLikes);
        return postRepository.save(existingPost);
    }


    // DELETE POST
    public void deletePost(

            Long id,

            String currentUserEmail,

            String currentUserRole
    ) {

        Post existingPost =
                postRepository
                        .findById(id)
                        .orElseThrow();

        boolean isOwner =
                existingPost
                        .getAuthorEmail()
                        .equals(currentUserEmail);

        boolean isAdmin =
                currentUserRole.equals("ADMIN");

        if (!isOwner && !isAdmin) {

            throw new RuntimeException(
                    "Unauthorized"
            );
        }

                postRepository.deleteById(id);

                // log deletion
                try {
                        Map<String, Object> log = new HashMap<>();
                        log.put("user", currentUserEmail);
                        log.put("action", "delete");
                        log.put("entityType", "post");
                        log.put("entityId", id);

                        restTemplate.postForObject(NODE_BACKEND + "/logs", log, String.class);
                } catch (Exception e) {
                        System.out.println("Delete log push failed: " + e.getMessage());
                }
    }


    public void deletePostsByAuthor(
            String authorEmail
    ) {

        postRepository.deleteByAuthorEmail(authorEmail);
    }
}
