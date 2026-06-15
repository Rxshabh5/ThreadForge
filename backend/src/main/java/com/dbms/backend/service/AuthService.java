package com.dbms.backend.service;

import com.dbms.backend.dto.RegisterRequest;

import com.dbms.backend.repository.UserRepository;

import com.dbms.backend.user.User;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.stereotype.Service;

import com.dbms.backend.dto.LoginRequest;

import com.dbms.backend.security.JwtUtil;

import java.util.HashMap;

import java.util.Map;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
private JwtUtil jwtUtil;


    public User register(
            RegisterRequest request
    ) {

        User user = new User();

        user.setUsername(
                request.getUsername()
        );

        user.setEmail(
                request.getEmail()
        );

        user.setPassword(
                passwordEncoder.encode(
                        request.getPassword()
                )
        );

        String requestedRole =
                request.getRole();

        String role =
                "ADMIN".equalsIgnoreCase(requestedRole)
                        ? "ADMIN"
                        : "USER";

        user.setRole(role);

        return userRepository.save(user);
    }
    public Map<String, String> login(
        LoginRequest request
) {

    User user = userRepository
            .findByEmail(
                    request.getEmail()
            )
            .orElseThrow();

    boolean matches =
            passwordEncoder.matches(
                    request.getPassword(),
                    user.getPassword()
            );

    if (!matches) {

        throw new RuntimeException(
                "Invalid password"
        );
    }

    String token =
            jwtUtil.generateToken(
                    user.getEmail()
            );

    Map<String, String> response =
            new HashMap<>();

    response.put(
            "token",
            token
    );

    response.put(
            "role",
            user.getRole()
    );

    response.put(
            "username",
            user.getUsername()
    );

    return response;
}
}
