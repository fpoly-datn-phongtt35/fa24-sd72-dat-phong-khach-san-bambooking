package com.example.datn.repository;

import com.example.datn.dto.response.VatTuLoaiPhongPhongResponse;
import com.example.datn.model.VatTuLoaiPhong;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


public interface TienIchPhongRepository extends JpaRepository<VatTuLoaiPhong,Integer> {
    @Query("select new com.example.datn.dto.response.VatTuLoaiPhongPhongResponse(ti.id," +
            "ti.vatTu.tenVatTu," +
            "ti.vatTu.hinhAnh," +
            "ti.loaiPhong.tenLoaiPhong)" +
            "from VatTuLoaiPhong ti")
    Page<VatTuLoaiPhongPhongResponse> TienIchPhong(Pageable pageable);

    @Query("select new com.example.datn.dto.response.VatTuLoaiPhongPhongResponse(ti.id," +
            "ti.vatTu.tenVatTu," +
            "ti.vatTu.hinhAnh," +
            "ti.loaiPhong.tenLoaiPhong)" +
            "from VatTuLoaiPhong ti WHERE ti.loaiPhong.id = :idLoaiPhong ")
    Page<VatTuLoaiPhongPhongResponse> findByIDLoaiPhong(Integer idLoaiPhong, Pageable pageable);

    @Query("SELECT t FROM VatTuLoaiPhong t WHERE t.loaiPhong.id = :idLoaiPhong")
    Page<Object> ListTienIchFindByIDLoaiPhong(@Param("idLoaiPhong") Integer idLoaiPhong,Pageable pageable);



}
