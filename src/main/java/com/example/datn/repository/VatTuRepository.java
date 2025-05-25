package com.example.datn.repository;

import com.example.datn.dto.response.VatTuResponse;
import com.example.datn.model.VatTu;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface VatTuRepository extends JpaRepository<VatTu,Integer> {
    @Query("select new com.example.datn.dto.response.VatTuResponse(ti.id," +
            "ti.tenVatTu," +
            "ti.hinhAnh," +
            "ti.gia," +
            "ti.trangThai)" +
            "from VatTu ti")
    Page<VatTuResponse> VatTu(Pageable pageable);


    @Query("SELECT tn FROM VatTu tn " +
            "WHERE tn.tenVatTu LIKE %:tenVatTu% "
    )
    Page<VatTu> search(@Param("tenVatTu") String keyword, Pageable pageable);



}
