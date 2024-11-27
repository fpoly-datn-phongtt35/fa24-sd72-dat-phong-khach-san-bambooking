package com.example.datn.repository;

import com.example.datn.model.ThongTinHoaDon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ThongTinHoaDonRepository extends JpaRepository<ThongTinHoaDon, Integer> {

    List<ThongTinHoaDon> findByHoaDonId(Integer idHoaDon);
}
