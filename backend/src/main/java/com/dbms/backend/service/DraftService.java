package com.dbms.backend.service;

import com.dbms.backend.entity.Draft;
import com.dbms.backend.entity.Post;
import com.dbms.backend.repository.DraftRepository;
import com.dbms.backend.repository.PostRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DraftService {

    @Autowired
    private DraftRepository draftRepository;

    @Autowired
        private PostRepository postRepository;

        @Autowired
        private PostService postService;

    public Draft saveDraft(
            Draft draft,
            String currentUserEmail,
            String currentUserRole
    ) {
        if (draft.getId() != null) {
            Draft existing = draftRepository.findById(draft.getId()).orElseThrow();
            boolean isOwner = existing.getAuthorEmail().equals(currentUserEmail);
            boolean isAdmin = "ADMIN".equals(currentUserRole);
            if (!isOwner && !isAdmin) {
                throw new RuntimeException("Unauthorized");
            }
        }
        draft.setAuthorEmail(currentUserEmail);
        return draftRepository.save(draft);
    }

    public List<Draft> getDrafts(
            String authorEmail
    ) {
        return draftRepository.findByAuthorEmail(authorEmail);
    }

    public Post publishDraft(
            Long draftId,
            String currentUserEmail,
            String currentUserRole
    ) {

        return moveDraftToPost(draftId, "published", currentUserEmail, currentUserRole);
    }

    public Post submitForReview(Long draftId, String currentUserEmail, String currentUserRole) {
        return moveDraftToPost(draftId, "review", currentUserEmail, currentUserRole);
    }

    private Post moveDraftToPost(Long draftId, String status, String currentUserEmail, String currentUserRole) {

        Draft draft =
                draftRepository
                        .findById(draftId)
                        .orElseThrow();

        boolean isOwner = draft.getAuthorEmail().equals(currentUserEmail);
        boolean isAdmin = "ADMIN".equals(currentUserRole);
        if (!isOwner && !isAdmin) {
            throw new RuntimeException("Unauthorized");
        }

        Post post =
                new Post();

        post.setTitle(
                draft.getTitle()
        );

        post.setContent(
                draft.getContent()
        );

        post.setCategory(
                draft.getCategory()
        );

        post.setAuthorEmail(
                draft.getAuthorEmail()
        );

        post.setAuthorRole(
                "USER"
        );

        post.setStatus(status);


        // Use PostService to ensure cross-service sync, versions, and logs
        Post publishedPost = postService.createPost(post);

        draftRepository.delete(
                draft
        );

        return publishedPost;
    }

        public void deleteDraft(Long id, String currentUserEmail, String currentUserRole) {
                Draft draft = draftRepository.findById(id).orElseThrow();
                boolean isOwner = draft.getAuthorEmail().equals(currentUserEmail);
                boolean isAdmin = "ADMIN".equals(currentUserRole);
                if (!isOwner && !isAdmin) {
                        throw new RuntimeException("Unauthorized");
                }
                draftRepository.delete(draft);
        }
}
