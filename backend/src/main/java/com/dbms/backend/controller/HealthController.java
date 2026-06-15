package com.dbms.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class HealthController {

    @GetMapping("/")
    public Map<String, Object> home() {
        return Map.of(
                "status", "ok",
                "service", "threadforge-spring-backend",
                "availableEndpoints", new String[] {
                        "/health",
                        "/auth/register",
                        "/auth/login",
                        "/posts"
                }
        );
    }

    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of("status", "ok");
    }
}
