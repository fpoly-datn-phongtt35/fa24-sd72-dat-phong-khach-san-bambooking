package com.example.datn.repository;

import com.example.datn.dto.response.TienIchPhongResponse;
import com.example.datn.model.TienIchPhong;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Objects;


public interface TienIchPhongRepository extends JpaRepository<TienIchPhong,Integer> {
    @Query("select new com.example.datn.dto.response.TienIchPhongResponse(ti.id," +
            "ti.tienIch.tenTienIch," +
            "ti.tienIch.hinhAnh," +
            "ti.loaiPhong.tenLoaiPhong)" +
            "from TienIchPhong ti")
    Page<TienIchPhongResponse> TienIchPhong( Pageable pageable);

    @Query("select new com.example.datn.dto.response.TienIchPhongResponse(ti.id," +
            "ti.tienIch.tenTienIch," +
            "ti.tienIch.hinhAnh," +
            "ti.loaiPhong.tenLoaiPhong)" +
            "from TienIchPhong ti WHERE ti.loaiPhong.id = :idLoaiPhong ")
    Page<TienIchPhongResponse> findByIDLoaiPhong( Integer idLoaiPhong, Pageable pageable);

    @Query("SELECT t FROM TienIchPhong t WHERE t.loaiPhong.id = :idLoaiPhong")
    Page<Object> ListTienIchFindByIDLoaiPhong(@Param("idLoaiPhong") Integer idLoaiPhong,Pageable pageable);



}
