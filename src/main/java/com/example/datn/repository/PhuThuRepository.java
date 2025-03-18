package com.example.datn.repository;

import com.example.datn.model.PhuThu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PhuThuRepository extends JpaRepository<PhuThu, Integer> {
    List<PhuThu> findByXepPhong_Id(Integer id);
}
