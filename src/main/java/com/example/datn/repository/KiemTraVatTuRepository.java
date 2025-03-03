package com.example.datn.repository;

import com.example.datn.model.KiemTraVatTu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface KiemTraVatTuRepository extends JpaRepository<KiemTraVatTu, Integer> {
}
