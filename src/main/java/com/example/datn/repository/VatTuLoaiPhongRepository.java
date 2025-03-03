package com.example.datn.repository;

import com.example.datn.model.VatTuLoaiPhong;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VatTuLoaiPhongRepository extends JpaRepository<VatTuLoaiPhong, Integer> {
    List<VatTuLoaiPhong> findByLoaiPhong_Id(Integer loaiPhongId);
}
