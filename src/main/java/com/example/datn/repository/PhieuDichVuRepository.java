package com.example.datn.repository;

import com.example.datn.model.PhieuDichVu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PhieuDichVuRepository extends JpaRepository<PhieuDichVu, Integer>{
    @Query("SELECT p FROM PhieuDichVu p WHERE p.dichVu.tenDichVu LIKE %:keyword%")
    List<PhieuDichVu> findByKeyword(@Param("keyword") String keyword);
}
