package com.example.datn.repository;

import com.example.datn.model.HoaDon;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface HoaDonRepository extends JpaRepository<HoaDon, Integer> {
    @Query("""
            SELECT hd FROM HoaDon hd
            WHERE hd.trangThai = :trangThai
            """)
    Page<HoaDon> findByTrangThai(String trangThai, Pageable pageable);

    boolean existsByMaHoaDon(String maHoaDon);
}
