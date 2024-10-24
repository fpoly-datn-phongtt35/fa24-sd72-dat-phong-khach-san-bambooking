package com.example.datn.repository;

import com.example.datn.model.ThongTinDatPhong;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ThongTinDatPhongRepository extends JpaRepository<ThongTinDatPhong, Integer> {
    @Query("SELECT t FROM ThongTinDatPhong t WHERE t.datPhong.id = :iddp")
    Page<ThongTinDatPhong> findByDatPhongId(@Param("iddp") Integer iddp, Pageable pageable);



}

