package com.academiax.course.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.academiax.course.entity.Course;

public interface CourseRepository extends JpaRepository<Course, Long> {
}