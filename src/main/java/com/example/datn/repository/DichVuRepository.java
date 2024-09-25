package com.example.datn.repository;

import com.example.datn.model.DichVu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DichVuRepository extends JpaRepository<DichVu,Integer> {
    @Query("SELECT dv FROM DichVu dv WHERE dv.trangThai = 'Hoạt động' AND dv.tenDichVu LIKE %:tenDichVu%")
    List<DichVu> findByTenDichVu(@Param("tenDichVu") String tenDichVu);

}
