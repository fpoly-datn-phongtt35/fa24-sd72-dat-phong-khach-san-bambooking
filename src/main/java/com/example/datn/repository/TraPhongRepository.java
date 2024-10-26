package com.example.datn.repository;

import com.example.datn.model.TraPhong;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TraPhongRepository extends JpaRepository<TraPhong, Integer> {
}
