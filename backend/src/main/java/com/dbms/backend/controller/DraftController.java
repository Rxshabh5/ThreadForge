package com.dbms.backend.controller;

import com.dbms.backend.entity.Draft;
import com.dbms.backend.entity.Post;
import com.dbms.backend.service.DraftService;
import com.dbms.backend.repository.UserRepository;
import com.dbms.backend.security.JwtUtil;
import com.dbms.backend.user.User;
import io.jsonwebtoken.Claims;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/drafts")
@CrossOrigin("*")
public class DraftController {

    @Autowired
    private DraftService draftService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    private User getCurrentUser(String authHeader) {
        String token = authHeader.substring(7);
        Claims claims = jwtUtil.validateToken(token);
        return userRepository.findByEmail(claims.getSubject()).orElseThrow();
    }

    @PostMapping
    public Draft saveDraft(
            @RequestBody Draft draft,
            @RequestHeader("Authorization") String authHeader
    ) {
        User currentUser = getCurrentUser(authHeader);
        return draftService.saveDraft(draft, currentUser.getEmail(), currentUser.getRole());
    }

    @GetMapping("/{email}")
    public List<Draft> getDrafts(
            @PathVariable String email,
            @RequestHeader("Authorization") String authHeader
    ) {
        User currentUser = getCurrentUser(authHeader);
        if (!currentUser.getEmail().equals(email) && !"ADMIN".equals(currentUser.getRole())) {
            throw new RuntimeException("Unauthorized");
        }
        return draftService.getDrafts(email);
    }

    @PostMapping("/publish/{id}")
    public Post publishDraft(
            @PathVariable Long id,
            @RequestHeader("Authorization") String authHeader
    ) {
        User currentUser = getCurrentUser(authHeader);
        return draftService.publishDraft(id, currentUser.getEmail(), currentUser.getRole());
    }

    @PostMapping("/review/{id}")
    public Post submitForReview(
            @PathVariable Long id,
            @RequestHeader("Authorization") String authHeader
    ) {
        User currentUser = getCurrentUser(authHeader);
        return draftService.submitForReview(id, currentUser.getEmail(), currentUser.getRole());
    }

        @DeleteMapping("/{id}")
        public Map<String, String> deleteDraft(
                        @PathVariable Long id,
                        @RequestHeader("Authorization") String authHeader
        ) {
                User currentUser = getCurrentUser(authHeader);
                draftService.deleteDraft(id, currentUser.getEmail(), currentUser.getRole());

                Map<String, String> res = new HashMap<>();
                res.put("message", "Draft deleted");
                return res;
        }
}
