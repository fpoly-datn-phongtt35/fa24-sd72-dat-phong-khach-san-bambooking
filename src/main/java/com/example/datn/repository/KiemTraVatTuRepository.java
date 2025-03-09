package com.example.datn.repository;

import com.example.datn.model.KiemTraVatTu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface KiemTraVatTuRepository extends JpaRepository<KiemTraVatTu, Integer> {

    List<KiemTraVatTu> findByKiemTraPhong_XepPhongIdAndTinhTrangIn(Integer xepPhongId, List<String> tinhTrang);

}
