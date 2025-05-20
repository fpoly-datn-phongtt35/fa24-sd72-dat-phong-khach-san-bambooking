package com.example.datn.repository;

import com.example.datn.model.PhuThu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PhuThuRepository extends JpaRepository<PhuThu, Integer> {
    @Query("SELECT p FROM PhuThu p WHERE p.trangThai = false and p.xepPhong.id =:id")
    List<PhuThu> findByXepPhong_Id(Integer id);

    PhuThu findTopByXepPhong_IdOrderByIdDesc(Integer idXepPhong);
    PhuThu findByXepPhong_IdAndTenPhuThu(Integer idXepPhong, String tenPhuThu);
}
