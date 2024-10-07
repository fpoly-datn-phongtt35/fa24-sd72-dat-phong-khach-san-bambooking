package com.example.datn.repository;

import com.example.datn.model.ThongTinDatPhong;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ThongTinDatPhongRepository extends JpaRepository<ThongTinDatPhong, Integer> {
}
