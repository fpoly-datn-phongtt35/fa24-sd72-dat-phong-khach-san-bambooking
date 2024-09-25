package com.example.datn.repository;

import com.example.datn.model.DatPhong;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface DatPhongRepository extends JpaRepository<DatPhong, Integer>{
    List<DatPhong> getPhieuDatPhongByMaDatPhong(String ma);
}
