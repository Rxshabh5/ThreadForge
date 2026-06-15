package com.dbms.backend.controller;

import com.dbms.backend.entity.Comment;
import com.dbms.backend.service.CommentService;
import com.dbms.backend.security.JwtUtil;
import com.dbms.backend.user.User;
import com.dbms.backend.repository.UserRepository;
import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/comments")
@CrossOrigin("*")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    private User getCurrentUser(String authHeader) {
        String token = authHeader.substring(7);
        Claims claims = jwtUtil.validateToken(token);
        String email = claims.getSubject();
        return userRepository.findByEmail(email).orElseThrow();
    }

    @GetMapping("/post/{postId}")
    public List<Comment> getComments(@PathVariable Long postId) {
        return commentService.getCommentsForPost(postId);
    }

    @PostMapping
    public Comment createComment(
            @RequestBody Comment comment,
            @RequestHeader("Authorization") String authHeader
    ) {
        User user = getCurrentUser(authHeader);
        comment.setAuthorEmail(user.getEmail());
        comment.setAuthorName(user.getUsername());
        comment.setAuthorHandle("@" + user.getEmail().split("@")[0]);
        if (comment.getCreatedAt() == null) {
            comment.setCreatedAt("Just now");
        }
        return commentService.addComment(comment);
    }

    @PostMapping("/{id}/like")
    public Comment likeComment(
            @PathVariable Long id,
            @RequestHeader("Authorization") String authHeader
    ) {
        getCurrentUser(authHeader);
        return commentService.likeComment(id);
    }
}
