package com.example.datn.repository;

import com.example.datn.model.PhuThu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PhuThuRepository extends JpaRepository<PhuThu, Integer> {
    @Query("SELECT p FROM PhuThu p WHERE p.trangThai = true and p.id =:id")
    List<PhuThu> findByXepPhong_Id(Integer id);
}
