package com.dbms.backend.controller;

import com.dbms.backend.entity.Post;

import com.dbms.backend.service.PostService;

import com.dbms.backend.security.JwtUtil;

import com.dbms.backend.repository.UserRepository;

import com.dbms.backend.user.User;

import io.jsonwebtoken.Claims;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController

@RequestMapping("/posts")

@CrossOrigin("*")
public class PostController {

    @Autowired
    private PostService postService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;


    private User getCurrentUser(
            String authHeader
    ) {

        String token =
                authHeader.substring(7);

        Claims claims =
                jwtUtil.validateToken(token);

        String email =
                claims.getSubject();

        return userRepository
                .findByEmail(email)
                .orElseThrow();
    }


    // GET ALL POSTS
    @GetMapping
    public List<Post> getPosts() {

        return postService.getAllPosts();
    }


    // CREATE POST
    @PostMapping
    public Post createPost(

            @RequestBody
            Post post,

            @RequestHeader("Authorization")
            String authHeader
    ) {

        User currentUser =
                getCurrentUser(authHeader);

        post.setAuthorEmail(
                currentUser.getEmail()
        );

        post.setAuthorRole(
                currentUser.getRole()
        );

        return postService.createPost(post);
    }


    // UPDATE POST
    @PutMapping("/{id}")
    public Post updatePost(

            @PathVariable
            Long id,

            @RequestBody
            Post updatedPost,

            @RequestHeader("Authorization")
            String authHeader
    ) {

        User currentUser =
                getCurrentUser(authHeader);

        return postService.updatePost(
                id,
                updatedPost,
                currentUser.getEmail(),
                currentUser.getRole()
        );
    }

    @PostMapping("/{id}/like")
    public Post likePost(
            @PathVariable Long id,
            @RequestBody Map<String, Object> payload,
            @RequestHeader("Authorization") String authHeader
    ) {
        User currentUser = getCurrentUser(authHeader);
        boolean liked = true;
        if (payload != null && payload.containsKey("liked")) {
            Object value = payload.get("liked");
            if (value instanceof Boolean) {
                liked = (Boolean) value;
            }
        }
        return postService.updatePostLikes(id, liked);
    }


    // DELETE POST
    @DeleteMapping("/{id}")
    public void deletePost(

            @PathVariable
            Long id,

            @RequestHeader("Authorization")
            String authHeader
    ) {

        User currentUser =
                getCurrentUser(authHeader);

        postService.deletePost(
                id,
                currentUser.getEmail(),
                currentUser.getRole()
        );
    }
}
