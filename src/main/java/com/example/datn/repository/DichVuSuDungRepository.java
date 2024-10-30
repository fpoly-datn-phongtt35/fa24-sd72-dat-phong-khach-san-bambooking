package com.example.datn.repository;

import com.example.datn.model.DichVuSuDung;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DichVuSuDungRepository extends JpaRepository<DichVuSuDung, Integer> {
    List<DichVuSuDung> findByXepPhongId(Integer id);
}
