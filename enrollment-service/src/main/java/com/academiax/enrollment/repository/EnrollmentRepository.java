package com.academiax.enrollment.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.academiax.enrollment.entity.Enrollment;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {

}