package com.dbms.backend.controller;

import com.dbms.backend.dto.RegisterRequest;
import com.dbms.backend.dto.LoginRequest;

import com.dbms.backend.service.AuthService;

import com.dbms.backend.user.User;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController

@RequestMapping("/auth")

@CrossOrigin("*")
public class AuthController {

    @Autowired
    private AuthService authService;


    @PostMapping("/register")
    public User register(

            @RequestBody
            RegisterRequest request
    ) {

        return authService.register(
                request
        );
    }


    @PostMapping("/login")
    public Map<String, String> login(

            @RequestBody
            LoginRequest request
    ) {

        return authService.login(
                request
        );
    }
}