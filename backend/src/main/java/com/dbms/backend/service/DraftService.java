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
            Draft draft
    ) {
        return draftRepository.save(draft);
    }

    public List<Draft> getDrafts(
            String authorEmail
    ) {
        return draftRepository.findByAuthorEmail(authorEmail);
    }

    public Post publishDraft(
            Long draftId
    ) {

        Draft draft =
                draftRepository
                        .findById(draftId)
                        .orElseThrow();

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


        // Use PostService to ensure cross-service sync, versions, and logs
        Post publishedPost = postService.createPost(post);

        draftRepository.delete(
                draft
        );

        return publishedPost;
    }

        public void deleteDraft(Long id) {
                draftRepository.deleteById(id);
        }
}