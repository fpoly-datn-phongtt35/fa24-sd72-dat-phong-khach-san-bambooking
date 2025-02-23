package com.example.datn.repository;

import com.example.datn.dto.response.VatTuLoaiPhongResponse;
import com.example.datn.model.VatTuLoaiPhong;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


public interface VatTuLoaiPhongRepository extends JpaRepository<VatTuLoaiPhong,Integer> {
    @Query("select new com.example.datn.dto.response.VatTuLoaiPhongResponse(ti.id," +
            "ti.loaiPhong.tenLoaiPhong," +
            "ti.vatTu.tenVatTu," +
            "ti.vatTu.hinhAnh," +
            "ti.vatTu.gia," +
            "ti.soLuong)" +
            "from VatTuLoaiPhong ti")
    Page<VatTuLoaiPhongResponse> VatTuLoaiPhong(Pageable pageable);

    @Query("select new com.example.datn.dto.response.VatTuLoaiPhongResponse(ti.id," +
            "ti.loaiPhong.tenLoaiPhong," +
            "ti.vatTu.tenVatTu," +
            "ti.vatTu.hinhAnh," +
            "ti.vatTu.gia," +
            "ti.soLuong)" +
            "from VatTuLoaiPhong ti WHERE ti.loaiPhong.id = :idLoaiPhong ")
    Page<VatTuLoaiPhongResponse> findByIDLoaiPhong(Integer idLoaiPhong, Pageable pageable);

    @Query("SELECT t FROM VatTuLoaiPhong t WHERE t.loaiPhong.id = :idLoaiPhong")
    Page<Object> ListVatTuFindByIDLoaiPhong(@Param("idLoaiPhong") Integer idLoaiPhong,Pageable pageable);



}
