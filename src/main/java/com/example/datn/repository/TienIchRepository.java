package com.example.datn.repository;

import com.example.datn.model.TienIch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TienIchRepository extends JpaRepository<TienIch,Integer> {
}
