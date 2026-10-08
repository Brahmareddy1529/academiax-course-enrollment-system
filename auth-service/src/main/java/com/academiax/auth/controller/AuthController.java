package com.academiax.auth.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.academiax.auth.entity.Student;
import com.academiax.auth.repository.StudentRepository;
import com.academiax.auth.service.JwtService;

@CrossOrigin(origins = "http://localhost:5178")
@RestController
@RequestMapping("/auth")
public class AuthController {

    private final JwtService jwtService;
    private final StudentRepository studentRepository;

    public AuthController(JwtService jwtService,
                          StudentRepository studentRepository) {
        this.jwtService = jwtService;
        this.studentRepository = studentRepository;
    }

    @PostMapping("/login")
    public Map<String, Object> login(@RequestParam String username,
                                     @RequestParam String password) {

        Student student = studentRepository
                .findByUsername(username)
                .orElse(null);

        Map<String, Object> response = new HashMap<>();

        if (student != null &&
            student.getPassword().equals(password)) {

            String token = jwtService.generateToken(username);

            response.put("token", token);
            response.put("studentId", student.getId());
            response.put("username", student.getUsername());
            response.put("name", student.getName());

            return response;
        }

        response.put("message", "Invalid username or password");
        return response;
    }
}