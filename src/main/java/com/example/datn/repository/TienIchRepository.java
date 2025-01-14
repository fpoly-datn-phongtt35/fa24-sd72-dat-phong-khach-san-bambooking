package com.example.datn.repository;

import com.example.datn.dto.response.VatTuResponse;
import com.example.datn.model.VatTu;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TienIchRepository extends JpaRepository<VatTu,Integer> {
    @Query("select new com.example.datn.dto.response.VatTuResponse(ti.id," +
            "ti.tenVatTu," +
            "ti.hinhAnh)" +
            "from VatTu ti")
    Page<VatTuResponse> TienIch(Pageable pageable);

    @Query("SELECT tn FROM VatTu tn " +
            "WHERE tn.tenVatTu LIKE %:tenTienIch% "
    )
    Page<VatTu> search(@Param("tenTienIch") String keyword, Pageable pageable);



}
