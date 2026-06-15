package com.dbms.backend.controller;

import com.dbms.backend.entity.Draft;
import com.dbms.backend.entity.Post;
import com.dbms.backend.service.DraftService;

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

    @PostMapping
    public Draft saveDraft(
            @RequestBody Draft draft
    ) {

        return draftService.saveDraft(
                draft
        );
    }

    @GetMapping("/{email}")
    public List<Draft> getDrafts(
            @PathVariable String email
    ) {

        return draftService.getDrafts(
                email
        );
    }

    @PostMapping("/publish/{id}")
    public Post publishDraft(
            @PathVariable Long id
    ) {

        return draftService.publishDraft(
                id
        );
    }

        @DeleteMapping("/{id}")
        public Map<String, String> deleteDraft(
                        @PathVariable Long id
        ) {

                draftService.deleteDraft(id);

                Map<String, String> res = new HashMap<>();
                res.put("message", "Draft deleted");
                return res;
        }
}