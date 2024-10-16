package com.example.datn.repository;

import com.example.datn.dto.response.LoaiPhongResponse;
import com.example.datn.dto.response.TienIchResponse;
import com.example.datn.model.LoaiPhong;
import com.example.datn.model.TienIch;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface LoaiPhongRepository extends JpaRepository<LoaiPhong, Integer>{
    @Query("select new com.example.datn.dto.response.LoaiPhongResponse(lp.id," +
            "lp.tenLoaiPhong," +
            "lp.dienTich," +
            "lp.sucChuaLon," +
            "lp.sucChuaNho," +
            "lp.moTa," +
            "lp.trangThai)" +
            "from LoaiPhong lp")
    Page<LoaiPhongResponse> LoaiPhong(Pageable pageable);

    @Query("SELECT lp FROM LoaiPhong lp " +
            "WHERE lp.tenLoaiPhong LIKE %:tenLoaiPhong% "
    )
    Page<LoaiPhong> search(@Param("tenLoaiPhong") String keyword, Pageable pageable);

}
