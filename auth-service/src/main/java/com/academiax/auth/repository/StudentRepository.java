package com.academiax.auth.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.academiax.auth.entity.Student;

public interface StudentRepository extends JpaRepository<Student, Long> {

    Optional<Student> findByUsername(String username);
}