package com.dbms.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "posts")
public class Post {

    @Id
    @GeneratedValue(
            strategy = GenerationType.IDENTITY
    )
    private Long id;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    private String category;

    // OWNER INFO
    private String authorEmail;

    private String authorRole;

    private Integer likes = 0;

    private Integer comments = 0;

    private Integer reposts = 0;

    private Integer bookmarks = 0;

    public Post() {
    }


    public Long getId() {

        return id;
    }

    public void setId(Long id) {

        this.id = id;
    }


    public String getTitle() {

        return title;
    }

    public void setTitle(
            String title
    ) {

        this.title = title;
    }


    public String getContent() {

        return content;
    }

    public void setContent(
            String content
    ) {

        this.content = content;
    }


    public String getCategory() {

        return category;
    }

    public void setCategory(
            String category
    ) {

        this.category = category;
    }


    public String getAuthorEmail() {

        return authorEmail;
    }

    public void setAuthorEmail(
            String authorEmail
    ) {

        this.authorEmail = authorEmail;
    }


    public String getAuthorRole() {

        return authorRole;
    }

    public void setAuthorRole(
            String authorRole
    ) {

        this.authorRole = authorRole;
    }

    public Integer getLikes() {
        return likes;
    }

    public void setLikes(Integer likes) {
        this.likes = likes;
    }

    public Integer getComments() {
        return comments;
    }

    public void setComments(Integer comments) {
        this.comments = comments;
    }

    public Integer getReposts() {
        return reposts;
    }

    public void setReposts(Integer reposts) {
        this.reposts = reposts;
    }

    public Integer getBookmarks() {
        return bookmarks;
    }

    public void setBookmarks(Integer bookmarks) {
        this.bookmarks = bookmarks;
    }
}