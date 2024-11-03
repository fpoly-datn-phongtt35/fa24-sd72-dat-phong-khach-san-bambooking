package com.example.datn.repository;

import com.example.datn.model.ThongTinHoaDon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ThongTinHoaDonRepository extends JpaRepository<ThongTinHoaDon, Integer> {
}
