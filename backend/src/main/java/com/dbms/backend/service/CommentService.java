package com.dbms.backend.service;

import com.dbms.backend.entity.Comment;
import com.dbms.backend.entity.Post;
import com.dbms.backend.repository.CommentRepository;
import com.dbms.backend.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private PostRepository postRepository;

    public List<Comment> getCommentsForPost(Long postId) {
        return commentRepository.findByPostId(postId);
    }

    public Comment addComment(Comment comment) {
        Comment saved = commentRepository.save(comment);
        Post post = postRepository.findById(comment.getPostId()).orElseThrow();
        post.setComments(post.getComments() == null ? 1 : post.getComments() + 1);
        postRepository.save(post);
        return saved;
    }

    public Comment likeComment(Long commentId) {
        Comment comment = commentRepository.findById(commentId).orElseThrow();
        comment.setLikes(comment.getLikes() == null ? 1 : comment.getLikes() + 1);
        return commentRepository.save(comment);
    }
}
