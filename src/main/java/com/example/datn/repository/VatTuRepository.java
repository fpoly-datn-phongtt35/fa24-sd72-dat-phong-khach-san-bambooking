package com.example.datn.repository;

import com.example.datn.model.VatTu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VatTuRepository extends JpaRepository<VatTu, Integer> {
}
